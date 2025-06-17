import { google } from 'googleapis';
import session from 'express-session';
import { redisDB } from '../../config/db.js';
import User from '../../models/user.js';
import { Router } from 'express';
import { RedisStore } from 'connect-redis';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { COOKIE_NAME } from '../../utils/constants.js';

const googleAuthRoutes = Router();
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
);

let sessionStore = new RedisStore({
    client: redisDB.client,
    prefix: process.env.REDIS_SESSION_PREFIX || 'sync_sess:'
});

const sessionConfig = {
    store: sessionStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000  // 1 day
    }
};

googleAuthRoutes.use(session(sessionConfig));


const state = crypto.randomBytes(32).toString('hex');

function getGoogleAuthURL() {
    const scopes = [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
    ];

    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        include_granted_scopes: true,
        response_type: 'code',
        scope: scopes,
        state
    });
}


// Google OAuth routes
googleAuthRoutes.get('/google/url', (req, res) => {
    req.session.state = state;
    return res.json({ url: getGoogleAuthURL() });
});

googleAuthRoutes.get('/google/callback', async (req, res) => {
    const { code, state, error } = req.query;

    if (error) {
        return res.status(400).json({ error: 'Google authentication failed' });
    } else if (state !== req.session.state) {
        return res.status(400).json({ error: 'State mismatch. Possible CSRF attack' });
    }

    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        const oauth2 = google.oauth2({
            auth: oauth2Client,
            version: 'v2'
        });

        const { data } = await oauth2.userinfo.get();

        if (!data.email || !data.name) {
            return res.status(400).json({ error: 'Google authentication failed' });
        }

        // Find or create user in database
        let [user, created] = await User.findOrCreate({
            where: { email: data.email },
            defaults: {
                googleId: data.id,
                fullname: data.name,
                email: data.email,
                image: data.image,
                active: true,
                privacypolicy: true
            }
        });

        // Update user data if it exists but some fields changed
        if (!created) {
            user = await user.update({
                googleId: data.id,
                fullname: data.name,
                email: data.email,
                image: data.image,
                active: true,
                privacypolicy: true
            });
        }

        const userPayload = {
            email: data.email,
            fullname: data.name,
            image: data.image,
            id: user._id.toString(),
        };

        const token = jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie(COOKIE_NAME, token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === 'production'
        });

        res.redirect('/');
    } catch (error) {
        console.error('Error during Google authentication:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
});

export default googleAuthRoutes;
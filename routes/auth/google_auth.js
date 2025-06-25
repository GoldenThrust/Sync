import { google } from 'googleapis';
import session from 'express-session';
import { redisDB } from '../../config/db.js';
import User from '../../models/user.js';
import { Router } from 'express';
import { RedisStore } from 'connect-redis';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { COOKIE_NAME, domain } from '../../utils/constants.js';
import Settings from '../../models/settings.js';

const googleAuthRoutes = Router();
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.VITE_SERVER_URL + process.env.GOOGLE_CALLBACK_URL
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

function getGoogleAuthURL(state) {
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
    const { redirect } = req.query;
    const localState = redirect ? Buffer.from(JSON.stringify({ redirect, state })).toString('hex') : state;
    req.session.state = localState;
    return res.json({ url: getGoogleAuthURL(localState) });
});

googleAuthRoutes.get('/google/callback', async (req, res) => {
    const { code, state, error } = req.query;
    
    if (error) {
        return res.status(400).json({ error: 'Google authentication failed' });
    } else if (!req.session.state || state !== req.session.state) {
        return res.status(400).json({ error: 'State mismatch. Possible CSRF attack' });
    }
    
    let redirect;
    try {
        // If state contains encoded redirect info, extract it
        if (state && state.length > 64) {
            const decodedState = JSON.parse(Buffer.from(state, 'hex').toString());
            redirect = decodedState.redirect;
        }
    } catch (e) {
        // If parsing fails, continue without redirect
        console.error('Error parsing state:', e);
    }    try {
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

        // Check if user already exists
        let user = await User.findOne({ email: data.email });

        let created = false;

        if (!user) {
            user = new User({
                googleId: data.id,
                fullname: data.name,
                email: data.email,
                image: data.image,
                active: true,
                privacypolicy: true
            });
            await user.save();

            const settings = new Settings({ user });
            await settings.save();
            created = true;
            await user.save();
        }

        // Update user data if it exists but some fields changed
        if (!created) {
            user = await User.findOneAndUpdate(
                { email: data.email },
                {
                    googleId: data.id,
                    fullname: data.name,
                    email: data.email,
                    image: data.image,
                    active: true,
                    privacypolicy: true
                },
                { new: true }
            );
        }

        const userPayload = {
            email: data.email,
            fullname: data.name,
            image: data.image,
            id: user._id.toString(),
        };

        const token = jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.clearCookie(COOKIE_NAME, {
            secure: true,
            sameSite: "none",
            httpOnly: true,
            domain,
            signed: true,
            path: "/",
        });

        const expires = new Date();
        expires.setDate(expires.getDate() + 7);

        res.cookie(COOKIE_NAME, token, {
            secure: true,
            sameSite: "none",
            httpOnly: true,
            path: "/",
            domain,
            expires,
            signed: true,
        });


        if (redirect) return res.redirect(redirect);
        return res.redirect('/');
    } catch (error) {
        console.error('Error during Google authentication:', error);
        return res.status(500).json({ error: 'Authentication failed' });
    }
});

export default googleAuthRoutes;
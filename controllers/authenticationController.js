import User from "../models/user.js";
import { hash, verify } from "argon2";
import { createToken } from "../middlewares/tokenManager.js";
import { COOKIE_NAME, domain } from "../utils/constants.js";
import mailService from "../config/mail.js";
import { redisDB } from "../config/db.js";
import { v7 as uuid } from 'uuid';
import fs from "fs";
import createOTP from "../utils/functions.js";
import Settings from "../models/settings.js";
import Session from "../models/session.js";



class AuthenticationController {
    async verify(req, res) {
        try {
            const user = req.user;

            const { fullname, email, image } = user;

            return res
                .status(200)
                .json({ status: "OK", response: { fullname, email, image } });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ status: "ERROR", data: "Internal Server Error" });
        }
    }

    async updateProfilePics(req, res) {
        const user = req.user;
        const { fullname, password } = user;

        if (fullname) user.fullname = fullname;
        if (password) user.password = await hash(password);

        if (fs.existsSync(user.image)) {
            fs.unlinkSync(user.image);
        }

        let image = '';
        if (req.file)
            image = req.file.path;

        if (image)
            user.image = image

        user.save()
        return res.status(200).json({ status: "OK" });
    }


    async register(req, res) {
        try {
            const { fullname, email, password } = req.body;
            let image = '';

            if (req.file) {
                image = req.file.path;
            }

            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(403).json({ status: "ERROR", response: "User already registered" });
            }

            const hashedPassword = await hash(password);
            const otp = createOTP();

            const user = { fullname, email, password: hashedPassword, image, otp }
            const token = uuid();

            await redisDB.set(`otp_${token}`, JSON.stringify(user), 60 * 60)


            try {
                await mailService.sendOTP(user, token)
            } catch (error) {
                console.error(error);
                return res.status(500).json({ status: "ERROR", response: "Failed to send activation link" });
            }

            return res
                .status(201)
                .json({ status: "OK", response: "We've sent an otp to your email. Please check your inbox to activate your account.", token });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ status: "ERROR", response: "Internal Server Error" });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(403).json({ status: "ERROR", response: "Account not registered" });
            }

            if (!user.active) {
                return res.status(403).json({ status: "ERROR", response: "Account is not active" })
            }

            if (!user.password) return await authContoller.forgotPassword(req, res);
            const isPasswordCorrect = await verify(user.password, password);
            if (!isPasswordCorrect) {
                return res.status(401).json({ status: "ERROR", response: "Password is incorrect" })
            }

            res.clearCookie(COOKIE_NAME, {
                secure: true,
                sameSite: "none",
                httpOnly: true,
                domain,
                signed: true,
                path: "/",
            });

            const token = createToken(user, "7d");
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

            const { fullname, image } = user;

            return res
                .status(200)
                .json({ status: "OK", response: { fullname, email, image, token } });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ status: "ERROR", response: "Internal Server Error" });
        }
    }


    async logout(req, res) {
        try {
            const user = await User.findById(res.jwt.id);
            if (!user) {
                return res.status(401).send({ response: "Account not registered OR Token malfunctioned" });
            }

            if (user._id.toString() !== res.jwt.id) {
                return res.status(403).send("Permissions didn't match");
            }

            res.clearCookie(COOKIE_NAME, {
                secure: true,
                sameSite: "none",
                httpOnly: true,
                domain,
                signed: true,
                path: "/",
            });


            return res
                .status(200)
                .json({ status: "OK" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ status: "ERROR", response: "Internal Server Error" });
        }
    }

    async activateAccount(req, res) {
        const {token, otp} = req.params;
        const { mail, redirect } = req.query;

        if (!otp) return res.status(400).json({ status: "OTP is required" });
        if (!token) return res.status(400).json({ status: "token is required" });


        const credential = JSON.parse(await redisDB.get(`otp_${token}`));

        if (!credential || credential['otp'] !== otp) {
            if (mail) return res.redirect(`/error?message=Invalid or expired token&code=401&redirect=/auth/login&redirectText=Login`);
            return res.status(401).json({ status: "ERROR", response: "Invalid or expired token" });
        }
        delete credential['otp'];

        try {
            const user = new User({ ...credential, active: true });

            await user.save();

            const settings = new Settings({ user });
            await settings.save();

            if (!user) {
                return res.status(500).json({ status: "ERROR", response: "User not found" });
            }




            res.clearCookie(COOKIE_NAME, {
                secure: true,
                sameSite: "none",
                httpOnly: true,
                domain,
                signed: true,
                path: "/",
            });

            const token = createToken(user, "7d");
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

            await redisDB.del(`otp_${token}`);
            delete credential['password'];
            credential['token'] = token;

            if (redirect) {
                const sessionId = redirect.split('/').pop();

                if (sessionId) {
                    const session = await Session.findOne({ sessionId });
                    if (session) {
                        const invitedGuestUser = session.invitedGuestUsers.includes(user.email);
                        const invitedUsers = session.invitedUsers.includes(user);

                        if (invitedGuestUser && !invitedUsers) {
                            session.activeUsers.push(user);
                            await session.save();
                        }
                    } else {
                        return res.status(404).json({ error: 'Session not found' });
                    }
                }
            }

            if (mail) return res.redirect(redirect ?? '/');
            return res
                .status(200)
                .json({ status: "OK", user: credential });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ status: "ERROR", response: "Internal Server Error" });
        }
    }


    async forgotPassword(req, res) {
        const {email} = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ status: "ERROR", response: "User not registered" });
        }

        const token = uuid()

        await redisDB.set(`reset_${token}`, email, 60 * 60);

        try {
            await mailService.sendResetPassword(user, token);
        } catch (error) {
            console.error(error)
            res.status(500).json({
                status: "ERROR",
                info: "password reset",
                response: "Failed to send reset password link"
            });
        }

        res.json({
            status: "OK",
            info: "password reset",
            response: "We've sent a password reset link to your email. Please check your inbox to reset your password."
        });
    }


    async resetPassword(req, res) {
        const { password } = req.body;
        const token = req.params.token;
        const email = await redisDB.get(`reset_${token}`);
        if (!email) {
            return res.status(401).json({ status: "ERROR", response: "Invalid or expired token" });
        }
        try {
            const hashedPassword = await hash(password);
            await User.findOneAndUpdate(
                { email },
                { $set: { password: hashedPassword } },
                { new: true }
            );

            await redisDB.del(`reset_${token}`);
            res.status(201).json({ status: "OK", response: "Password reset successfully" })
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: "ERROR", response: "Internal Server Error" });
        }
    }
}

const authContoller = new AuthenticationController();

export default authContoller;
```javascript
import { createMagicLoginLink, validateMagicLoginLink, getUserById, validateGoogleUser, getUserByEmail, createGoogleUser } from "../../services/core/user.service.js";
import { generateJWTTokenPair } from "../../utils/jwt.service.js";
import { BlackList } from "../../models/core/black-list.model.js";
import rateLimit from 'express-rate-limit';

// Rate limiting middleware for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per windowMs
    message: 'Too many authentication attempts, please try again later'
});

export const magicLoginController = [authLimiter, async (req, res, next) => {
    try {
        if (!req.body.email) {
            const error = new Error("Bad request")
            error.statusCode = 400
            throw error
        }

        const { ok, isNewUser } = await createMagicLoginLink(req.body.email, req.body.redirectUrl)
        res.status(200).json({
            statusCode: 200,
            response: {
                ok,
                isNewUser
            }
        })
    } catch (err) {
        const error = new Error(err);
        error.statusCode = err.statusCode || 500;
        next(err)
    }
}]

export const validateLoginMagicLinkController = [authLimiter, async (req, res, next) => {
    try {
        const token = await validateMagicLoginLink(req.body.token)
        const user = await getUserById(token.user?.uuid)
        const tokenPair = await generateJWTTokenPair(user)
        res.status(200).json({
            statusCode: 200,
            response: tokenPair
        })
        await token.updateOne({
            $set: {
                isRevoked: true
            }
        })
    } catch (err) {
        const error = new Error(err);
        error.statusCode = err.statusCode || 500;
        next(err)
    }
}]

export const authenticateWithGoogleController = [authLimiter, async (req, res, next) => {
    try {
        const token = req.headers["x-google-auth"]
        if (!token) {
            const error = new Error("Bad request")
            error.statusCode = 400
            throw error
        }
        const payload = await validateGoogleUser(token)
        if (!payload.email) {
            const error = new Error("Failed to authenticate with google")
            error.statusCode = 401
            throw error
        }
        let user = await getUserByEmail(payload.email);
        let isNewUser = false;
        if (!user) {
            isNewUser = true;
            user = await createGoogleUser(payload)
        }
        const tokenPair = await generateJWTTokenPair(user)
        res.status(200).json({
            statusCode: 200,
            response: {
                ...tokenPair,
                isNewUser
            }
        })
    } catch (err) {
        next(err)
    }
}]

export const logOutController = async (req, res, next) => {
    try {
        const { authorization: header } = req.headers;
        if (!header) {
            throw new Error("Unauthorized")
        }
        const token = header.split(' ')[1]
        const checkIfBlacklisted = await BlackList.findOne({ token: token });
        if (checkIfBlacklisted) return res.sendStatus(204);
        const newBlacklist = new BlackList({
            token: token
        });
        await newBlacklist.save();
        res.setHeader('Clear-Site-Data', '"cookies"');
        res.status(200).json({
            statusCode: 200,
            message: 'You are logged out!'
        })
    } catch (err) {
        next(err)
    }
}
```
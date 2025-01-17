import { User } from "../../models/core/user.model.js";
import { generateHash, verifyPasswordHash, sendEmail, readTemplateFile, generateRandomPassword } from "../../utils/helper.service.js";
import generator from "crypto-random-string";
import { environment } from "../../loaders/environment.loader.js";
import { OauthClient } from "../../loaders/google.loader.js";
import { LoginLink } from "../../models/core/login-link.model.js";

const getUserByEmail = async (email) => {
    const user = await User.findOne({
        $or: [
            {
                email
            },
            ...(email ? [{
                "accounts.google.email": email
            }] : []),
            ...(email ? [{
                "accounts.local.email": email
            }] : [])
        ]

    })
    return user
}

const createEmailUser = async ({
    userName,
    email,
    password
}) => {
    let user = await getUserByEmail(email);
    if (user) {
        const error = new Error("User already exists");
        error.statusCode = 400;
        throw error;
    }
    const hash = await generateHash(password);
    user = await User.create({
        userName,
        accounts: {
            local: {
                email,
                password: hash
            }
        }
    })
    return user;
}

const validateEmailUser = async (email, password) => {
    const user = await User.findOne({
        'accounts.local.email': email
    })
    if (!user) {
        const error = new Error("Invalid email or password")
        error.statusCode = 401;
        throw error
    }
    const verifyPassword = await verifyPasswordHash(password, user.accounts.local.password);
    if (!verifyPassword) {
        const error = new Error("Invalid email or password")
        error.statusCode = 401;
        throw error
    }
    return user
}

const createMagicLoginLink = async (email, redirectUrl) => {
    const token = generator({
        length: 36,
        type: "url-safe"
    })
    let user = await getUserByEmail(email);
    let isNewUser = false;
    if (!user) {
        isNewUser = true;
        const userName = email.split('@')[0];
        user = await createEmailUser({ userName, email, password: generateRandomPassword() })
    }
    await LoginLink.create({
        token,
        type: "login",
        user: user._id
    })
    await sendEmail({
        from: {
            name: 'Userarraybot',
            address: `hello@trymarch.dev`
        },
        to: {
            address: user?.accounts?.local?.email || user?.accounts?.google?.email
        },
        subject: `[userarray] Login link`,
        content: await readTemplateFile('magic-link', {
            name: user.userName || user.fullName,
            token,
            redirectUrl,
            host: environment.WEB_HOST
        })
    })

    return { ok: "ok", isNewUser };
}

const validateMagicLoginLink = async (token) => {
    // TODO: Add expiry time
    const magicLink = await LoginLink.findOne({
        token,
        isRevoked: false
    }).populate({
        path: "user",
        select: "fullName uuid"
    })
    if (!magicLink) {
        const error = new Error("Invalid Magic Link")
        error.statusCode = 404;
        throw error;
    }
    return magicLink;
}

const userProfileDelete = async (id) => {
    const user = await User.findOneAndDelete({
        uuid: id
    })
    if (!user) {
        const error = new Error("User does not exist")
        error.statusCode = 404;
        throw error
    }
    return user;
}
const getUserById = async (id) => {
    const user = await User.findOne({
        uuid: id
    }, {
        'accounts.local.password': 0,
        updatedAt: 0,
        __v: 0
    })
    if (!user) {
        const error = new Error("User does not exist")
        error.statusCode = 404;
        throw error
    }
    return user;
}

const updateUser = async (user, { firstName, lastName, userName, avatar, hasFinishedOnboarding, onboarding, timezone }) => {
   
    const _user = await getUserById(user)
    const updated = await _user.updateOne({
        $set: {
            firstName: firstName || _user.firstName,
            lastName: lastName || _user.lastName,
            userName: userName || _user.userName,
            avatar: avatar || _user.avatar,
            timezone,
            hasFinishedOnboarding,
            onboarding: {
                ..._user.onboarding,
                ...onboarding
            }
        }
    }, {
        new: true
    })
    return updated;
}

const updateUserOnBoarded = async (user, hasFinishedOnboarding) => {
    const _user = await getUserById(user)
    const updated = await _user.updateOne({
        $set: {
            hasFinishedOnboarding: hasFinishedOnboarding || _user.hasFinishedOnboarding
        }
    }, {
        new: true
    })
    return updated;
}

const validateGoogleUser = async (token) => {
    const { tokens } = await OauthClient.getToken({
        code: token,
        client_id: environment.GOOGLE_CLIENT_ID,
        redirect_uri: 'postmessage'
    });
    const ticket = await OauthClient.verifyIdToken({
        idToken: tokens.id_token,
        audience: environment.GOOGLE_CLIENT_ID
    })
    const payload = ticket.getPayload()
    return {
        userId: payload.sub,
        email: payload.email,
        firstName: payload.given_name,
        lastName: payload.family_name,
        avatar: payload.picture
    }
}

const createGoogleUser = async ({
    firstName,
    lastName,
    userName,
    email,
    id,
    avatar,
    timezone
}) => {
    let user = await User.findOne({
        'accounts.google.email': email
    })
    if (user) {
        const error = new Error("User already exists")
        error.statusCode = 400;
        throw error
    }
    user = await User.create({
        firstName,
        lastName,
        userName,
        accounts: {
            google: {
                email,
                id,
                isVerified: true
            }
        },
        avatar,
        userTimezone: timezone
    })
    return user;
}

export {
    createEmailUser,
    getUserByEmail,
    validateEmailUser,
    createMagicLoginLink,
    validateMagicLoginLink,
    getUserById,
    updateUser,
    updateUserOnBoarded,
    validateGoogleUser,
    createGoogleUser,
    userProfileDelete
}

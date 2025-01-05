import { Schema } from "mongoose";
import { v4 as uuid } from "uuid";
import { db } from "../../loaders/db.loader.js";
import moment from 'moment-timezone';

const allTimezones = moment.tz.names();
const USER_TIMEZONE_CHOICES = allTimezones.map(timezone => timezone);

const UserSchema = new Schema({
    uuid: {
        type: String,
        default: () => uuid()
    },
    firstName: {
        type: Schema.Types.String
    },
    lastName: {
        type: Schema.Types.String
    },
    userName: {
        type: Schema.Types.String
    },
    avatar: {
        type: Schema.Types.String,
        default: ''
    },
    roles: {
        type: Schema.Types.Array,
        default: ["user"]
    },

    timezone: {
        type: String,
        default: 'UTC',
        enum: USER_TIMEZONE_CHOICES
    },
    lastWorkspace: {
        type: Schema.Types.ObjectId,
        ref: "Workspace"
    },
    hasFinishedOnboarding: {
        type: Schema.Types.Boolean,
        default: false
    },
    accounts: {
        local: {
            email: {
                type: Schema.Types.String,
                validate: {
                    validator: (e) => {
                        return /^[a-z0-9][a-z0-9-_.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/.test(e)
                    }
                }
            },
            password: {
                type: Schema.Types.String
            },
            isVerified: {
                type: Schema.Types.Boolean,
                default: false
            }
        },
        google: {
            email: {
                type: Schema.Types.String,
                validate: {
                    validator: (e) => {
                        return /^[a-z0-9][a-z0-9-_.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/.test(e)
                    }
                }
            },
            id: {
                type: Schema.Types.String
            },
            isVerified: {
                type: Schema.Types.Boolean,
                default: false
            },
            hasAuthorizedEmail: {
                type: Schema.Types.Boolean,
                default: false
            }
        }
    }
}, {
    timestamps: true
})
const User = db.model('User', UserSchema, 'users')

export {
    User
};

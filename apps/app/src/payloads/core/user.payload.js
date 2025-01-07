import Joi from "joi";
import moment from 'moment-timezone';

const allTimezones = moment.tz.names();
const USER_TIMEZONE_CHOICES = allTimezones.map(timezone => timezone);

const UpdateUserPayload = Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    userName: Joi.string().optional(),
    avatar: Joi.string().optional(),
    onboarding: Joi.object({
        profile_complete: Joi.boolean().optional(),
        workspace_create: Joi.boolean().optional(),
        linner_connect: Joi.boolean().optional(),
        team_create: Joi.boolean().optional(),
        workspace_invite: Joi.boolean().optional(),
        workspace_join: Joi.boolean().optional()
    }).optional(),
    hasFinishedOnboarding: Joi.boolean().optional(),
    timezone: Joi.string().valid(...USER_TIMEZONE_CHOICES).optional(),
    lastWorkspace: Joi.string().optional()
});

export {
    UpdateUserPayload
}

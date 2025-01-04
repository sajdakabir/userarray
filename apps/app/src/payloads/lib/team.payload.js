import Joi from "joi";

const CreateTeamPayload = Joi.object({
    name: Joi.string().required(),
    key: Joi.string().required(),
    description: Joi.string().optional(),
    linearTeamId: Joi.string().optional()
});

const UpdateTeamPayload = Joi.object({
    name: Joi.string().optional()
});

export {
    CreateTeamPayload,
    UpdateTeamPayload
}
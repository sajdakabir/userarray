import Joi from "joi";

const CreateSpacePayload = Joi.object({
    name: Joi.string().required(),
    identifier: Joi.string().required()
});

const UpdateSpacePayload = Joi.object({
    name: Joi.string().optional()
});

export {
    CreateSpacePayload,
    UpdateSpacePayload
}

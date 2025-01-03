import Joi from "joi";

const CreateWorkspacePayload = Joi.object({
    name: Joi.string().required(),
    slug: Joi.string().required(),
    website: Joi.string().required()
});

const UpdateWorkspacePayload = Joi.object({
    name: Joi.string().optional()
});

export {
    CreateWorkspacePayload,
    UpdateWorkspacePayload
}

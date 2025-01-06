import Joi from "joi";

const CreateWorkspacePayload = Joi.object({
    name: Joi.string().required(),
    slug: Joi.string().required(),
    website: Joi.string().optional()
});

const UpdateWorkspacePayload = Joi.object({
    name: Joi.string().optional(),
    website: Joi.string().optional()
});

export {
    CreateWorkspacePayload,
    UpdateWorkspacePayload
}

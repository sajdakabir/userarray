import Joi from "joi";

const CreateLabelPayload = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional(),
    color: Joi.string().optional()
});

const UpdateLabelPayload = Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    color: Joi.string().optional()
});

export {
    CreateLabelPayload,
    UpdateLabelPayload
}

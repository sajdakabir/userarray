import Joi from "joi";

const CreateCyclePayload = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional()
});

export {
    CreateCyclePayload
}

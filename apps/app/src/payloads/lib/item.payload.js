import Joi from "joi";

const ItemPayload = Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    color: Joi.string().optional(),
    status: Joi.string().optional(),
    effort: Joi.string().optional(),
    dueDate: Joi.string().optional(),
    roadmaps: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)).optional(),
    // cycles: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)).optional().allow(null, []),
    cycles: Joi.alternatives().try(
        Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)).optional(),
        Joi.array().length(0).optional(),
        Joi.valid(null)
    ),
    parent: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
    assignees: Joi.alternatives().try(
        Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)).optional(),
        Joi.array().length(0).optional(),
        Joi.valid(null)
    ),
    labels: Joi.alternatives().try(
        Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)).optional(),
        Joi.array().length(0).optional(),
        Joi.valid(null)
    )
});

export {
    ItemPayload
}

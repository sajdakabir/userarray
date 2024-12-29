import Joi from "joi";

const CreateUpdateNotePayload = Joi.object({
    content: Joi.string().optional(),
    date: Joi.date().optional()
});

export {
    CreateUpdateNotePayload
}

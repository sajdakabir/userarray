import { createUpdateNote, getMembersNoteNote } from "../../services/lib/note.server.js";
import { CreateUpdateNotePayload } from "../../payloads/lib/note.payload.js";
import moment from "moment-timezone";

const createUpdateNoteController = async (req, res, next) => {
    try {
        const { error, value } = CreateUpdateNotePayload.validate(req.body);

        if (error) {
            const err = error.details[0].message;
            err.statusCode = 400;
            throw err;
        }
        const { date, content } = value;
        const user = (res.locals.user)._id;
        const workspace = (res.locals.workspace)._id;
        const noteDate = moment(date).startOf('day').toDate();
        const note = await createUpdateNote(noteDate, content, user, workspace)
        res.json({
            status: 200,
            response: note
        });
    } catch (err) {
        next(err);
    }
}

const getMembersNoteController = async (req, res, next) => {
    try {
        const { member: id, date } = req.params;
        const workspace = res.locals.workspace;
        const noteDate = moment(date).startOf('day').toDate();
        const note = await getMembersNoteNote(noteDate, id, workspace._id)
        res.json({
            status: 200,
            response: note
        });
    } catch (err) {
        next(err);
    }
}

export {
    createUpdateNoteController,
    getMembersNoteController
}

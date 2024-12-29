import { Note } from "../../models/lib/notes.model.js";
import moment from "moment-timezone";

const createUpdateNote = async (noteDate, content, user, workspace) => {
    const note = await Note.findOneAndUpdate(
        { date: noteDate, user, workspace },
        { $set: { content } },
        { new: true, upsert: true }
    );
    return note;
}

const getMembersNoteNote = async (noteDate, user, workspace) => {
    const note = await Note.findOne({ date: noteDate, user, workspace });
    if (!note) {
        return null;
    }

    return note;
}

const getUserTodayNote = async (workspace, user) => {
    const today = moment().startOf('day');
    const note = await Note.findOne({ date: today, user, workspace });
    if (!note) {
        return null;
    }
    return note;
}

export {
    createUpdateNote,
    getMembersNoteNote,
    getUserTodayNote
}

// export const up = async (db, client) => {
//     await db.collection('items').updateMany({}, [
//         { $set: { dueDate: { $cond: { if: { $eq: ["$startDate", null] }, then: "$endDate", else: "$startDate" } } } },
//         { $unset: ["startDate", "endDate"] }
//     ]);
// };

export const up = async (db, client) => {
    await db.collection('items').updateMany({}, [
        { $set: { dueDate: { $cond: { if: { $eq: ["$startDate", null] }, then: "$endDate", else: "$startDate" } } } }
    ]);
};

export const down = async (db, client) => {
    await db.collection('items').updateMany({}, [
        { $unset: { dueDate: "" } }
        // if wants to undo the changes
    ]);
};
// migrate-mongo up

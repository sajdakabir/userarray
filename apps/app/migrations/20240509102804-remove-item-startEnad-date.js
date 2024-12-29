export const up = async (db, client) => {
    await db.collection('items').updateMany({}, [
        { $unset: ["startDate", "endDate"] }
    ]);
}
export const down = async (db, client) => {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
};

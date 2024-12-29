export const up = async (db, client) => {
    // Drop the priority field from the collection
    await db.collection('items').updateMany(
        { },
        { $unset: { priority: "" } }
    );
};

export const down = async (db, client) => {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
};

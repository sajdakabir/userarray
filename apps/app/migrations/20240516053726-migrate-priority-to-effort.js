export const up = async (db, client) => {
    // Define the mappings between priorityChoices and effortChoices
    const priorityToEffortMap = {
        "urgent": "large",
        "high": "medium",
        "medium": "small",
        "low": "small",
        "none": "none"
    };

    // Find all documents in the collection
    const itemsCursor = db.collection('items').find();

    // Iterate over each document
    while (await itemsCursor.hasNext()) {
        const item = await itemsCursor.next();

        // Update the priority field to effort based on the mapping
        const updatedItem = {
            ...item,
            effort: priorityToEffortMap[item.priority]
        };

        // Remove the priority field from the document
        delete updatedItem.priority;

        // Update the document in the collection
        await db.collection('items').updateOne(
            { _id: item._id },
            { $set: updatedItem }
        );
    }
};

export const down = async (db, client) => {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
};

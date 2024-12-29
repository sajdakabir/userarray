import { getItemActivites, getCycleActivites, mergeAndSortActivitiesAndComments } from "../../services/lib/activity.service.js";
import { getCycleComments, getItemComments } from "../../services/lib/comment.service.js";

const getItemActivityController = async (req, res, next) => {
    try {
        const { item: id } = req.params;
        const space = res.locals.space;
        const itemActivities = await getItemActivites(id, space);
        const itemComments = await getItemComments(id, space);
        if (req.query.activityType === 'itemProperty') {
            return res.status(200).json(itemActivities);
        }

        if (req.query.activityType === 'itemComment') {
            return res.status(200).json(itemComments);
        }

        const resultList = mergeAndSortActivitiesAndComments(itemActivities, itemComments);

        res.status(200).json({
            status: 200,
            response: resultList
        });
    } catch (err) {
        next(err);
    }
};

const getCycleActivityController = async (req, res, next) => {
    try {
        const { cycle: id } = req.params;
        const space = res.locals.space;
        const cycleActivities = await getCycleActivites(id, space);
        const cycleComments = await getCycleComments(id, space);
        if (req.query.activityType === 'cycleProperty') {
            return res.status(200).json(cycleActivities);
        }

        if (req.query.activityType === 'cycleComment') {
            return res.status(200).json(cycleComments);
        }

        const resultList = mergeAndSortActivitiesAndComments(cycleActivities, cycleComments);

        res.status(200).json({
            status: 200,
            response: resultList
        });
    } catch (err) {
        next(err);
    }
};

export {
    getItemActivityController,
    getCycleActivityController
}

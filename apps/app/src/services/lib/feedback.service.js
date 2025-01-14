import { Issue } from "../../models/lib/issue.model.js";

export const createFeedback = async (requestedData, user, workspace) => {       
       console.log("Feedback created", requestedData);
       console.log("yes", user.id);

       const issue = new Issue({
            ...requestedData,
            source: "feedback",
            createdBy: user.id,
            workspace: workspace._id
         });
       await issue.save();
       return issue;
}
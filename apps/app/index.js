import { app } from "./src/index.js";
import { environment } from "./src/loaders/environment.loader.js";
import { issueActivityWorker } from "./src/jobs/activity.job.js";

(async function init () {
    app.listen(environment.PORT, () => {
        console.log(`Server listening on port ${environment.PORT}`)
    })
})()

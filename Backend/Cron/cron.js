import cron from  "node-cron";


import eventModel from '../Module/eventModel.js';


// Schedule the job to run at midnight
cron.schedule("* * * * * *", async () => {
    try {
        const currentDate = new Date();
        
        const result = await eventModel.updateMany(
            { endDate: { $lt: currentDate }, status: "ongoing" },
            { $set: { status: "expired" } }
        );

        console.log(`Updated ${result.modifiedCount} records to expired.`);
    } catch (error) {
        console.error("Error updating expired statuses:", error);
    }
});

export default cron



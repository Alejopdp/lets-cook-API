import mongoose from "mongoose";
import { logger, restoreDb } from "../../../../config";

export const connectToDatabase = async () => {
    // const IS_NOT_RUNNING_IN_DEVELOPMENT = process.env.NODE_ENV !== "development"
    const mongoUri: string = ((process.env.URLDB as string) + process.env.NODE_ENV) as string;

    try {
        await mongoose.connect(mongoUri, { maxPoolSize: 400 });
        // mongoose.set("debug", IS_NOT_RUNNING_IN_DEVELOPMENT);

        // await resetDatabase();
        logger.info(`Connected to: ${mongoUri}`)
    } catch (error) {
        console.log(error);
        logger.error(error);
    }
};

const resetDatabase = async () => {
    if (restoreDb) {
        // await mongoose.connection.db.dropDatabase();
        // logger.info("Database dropped");
        // await loadMockData();
    }
};

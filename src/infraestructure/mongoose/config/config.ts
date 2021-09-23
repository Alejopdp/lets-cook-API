import mongoose from "mongoose";
import { logger, restoreDb } from "../../../../config";
// import { loadMockData } from "../../../../scripts/db";
import { getConfig } from "../../../config/config";
import * as dotenv from "dotenv";

dotenv.config();
export const connectToDatabase = async () => {
    // const mongoUri: string = ((process.env.URLDB as string) + process.env.NODE_ENV) as string;
    const mongoUri: string = ((process.env.URLDB as string) + "staging") as string;

    try {
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });
        mongoose.set("debug", true);

        // await resetDatabase();
        logger.info("Database connected");
    } catch (error) {
        console.log(error);
        logger.error(error);
    }
};

// const resetDatabase = async () => {
//     if (restoreDb) {
//         await mongoose.connection.db.dropDatabase();
//         logger.info("Database dropped");
//         await loadMockData();
//         logger.info("Data correctly loaded");
//     }
// };

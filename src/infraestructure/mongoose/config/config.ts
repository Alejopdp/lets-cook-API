import mongoose from "mongoose";
import { logger, restoreDb } from "../../../../config";
import { loadMockData } from "../../../../scripts/db";
import { User, Role } from "../models";

export const connectToDatabase = async () => {
    const mongoUri: string = ((process.env.URLDB as string) + process.env.NODE_ENV) as string;

    try {
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });

        await resetDatabase();
        logger.info("Database connected");
    } catch (error) {
        logger.error(error);
    }
};

const resetDatabase = async () => {
    if (restoreDb) {
        await mongoose.connection.db.dropDatabase();
        await loadMockData();
    }
};

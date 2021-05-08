import mongoose from "mongoose";
import { logger } from "../../../../config";
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

        logger.info("Database connected");
    } catch (error) {
        logger.error(error);
    }
};

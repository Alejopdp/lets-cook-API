import mongoose from "mongoose";
import { logger, restoreDb } from "../../../../config";
import { loadMockData } from "../../../../scripts/db";

export const connectToDatabase = async () => {
    const mongoUri: string = "mongodb+srv://lets_cook_admin:Rwn7Bu2VJqju6Yia@ecommerce.6octe.mongodb.net/staging";

    try {
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });
        // mongoose.set("debug", true);

        await resetDatabase();
        logger.info("Database connected");
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
        logger.info("Data correctly loaded");
    }
};

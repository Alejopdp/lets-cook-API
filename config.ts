import * as dotenv from "dotenv";
// import * as admin from "firebase-admin";
import winston from "winston";

dotenv.config();

const enviroment = process.env.NODE_ENV || "Development";
const port = process.env.PORT || "3001";

// Logging

function setUpLogger() {
    const logFormat = winston.format.printf((info) => `[${info.timestamp}][${String(info.level)}]: ${info.message}`);
    winston.loggers.add("default", {
        format: winston.format.combine(
            winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
            winston.format.metadata({ fillExcept: ["message", "level", "timestamp", "label"] }),
            winston.format.splat(),
            logFormat
        ),
        transports: [
            new winston.transports.Console({
                level: "silly",
                format: winston.format.combine(winston.format.colorize(), logFormat),
            }),
            new winston.transports.File({
                level: "silly",
                filename: "logs/Ecolophy.log",
                maxsize: 10485760,
            }),
        ],
    });
}

setUpLogger();
const logger = winston.loggers.get("default");

// Configuración token

process.env.SEED = process.env.SEED || "dev-seed";
process.env.CADUCIDAD_TOKEN = "30d";

var restoreDb = process.env.DB_RESTORE || false;

// Conecto con Firebase

// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
// });

export { restoreDb, logger, enviroment };

import * as dotenv from "dotenv";
import winston from "winston";
import fs from "fs";

dotenv.config();

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
                filename: "logs/logs.log",
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

const getConfig = (key: string): string => {
    const envConfig = dotenv.parse(fs.readFileSync(`.env`));
    if (key in process.env) {
        return process.env[key]!;
    }

    return envConfig[key];
};

var restoreDb = process.env.DB_RESTORE || false;

export { restoreDb, logger, getConfig };

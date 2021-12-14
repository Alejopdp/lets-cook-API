import { mongooseLogRepository } from "../../infra/repositories/log";
import { GetLogs } from "./getLogs";
import { GetLogsController } from "./getLogsController";
import { GetLogsPresenter } from "./getLogsPresenter";

export const getLogs: GetLogs = new GetLogs(mongooseLogRepository);
export const getLogsPresenter: GetLogsPresenter = new GetLogsPresenter();
export const getLogsController: GetLogsController = new GetLogsController(getLogs, getLogsPresenter);

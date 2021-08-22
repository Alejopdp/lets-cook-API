import { Transaction } from "@sentry/types";

export interface IMonitoringService {
    catchException(exception: Error): void;
    createTransaction(op: string, name: string): Transaction;
    endTransaction(transaction: Transaction): void;
}

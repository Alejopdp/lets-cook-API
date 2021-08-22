import * as Sentry from "@sentry/node";
import { Transaction } from "@sentry/types";
import * as Tracing from "@sentry/tracing";
import { IMonitoringService } from "./IMonitoringService";

export class SentryService implements IMonitoringService {
    public catchException(exception: Error): void {
        Sentry.captureException(exception);
    }

    public createTransaction(op: string, name: string): Transaction {
        const transaction = Sentry.startTransaction({
            op,
            name,
        });

        return transaction;
    }

    public endTransaction(transaction: Transaction): void {
        transaction.finish();
    }
}

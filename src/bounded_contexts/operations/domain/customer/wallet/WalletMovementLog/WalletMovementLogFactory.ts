import { CustomerId } from "../../CustomerId";
import { ChargeWalletLog } from "./ChargeWalletLog";
import { CreateWalletLog } from "./CreateWalletLog";
import { DisableWalletLog } from "./DisableWalletLog";
import { EnableWalletLog } from "./EnableWalletLog";
import { PaySaturdayJobWithWalletLog } from "./PaySaturdayJobWithWalletLog";
import { PurchasePlanWithWalletLog } from "./PurchasPlanWithWalletLog";
import { SelectWalletAsDefaultLog } from "./SelectWalletAsDefaultLog";
import { WalletMovementLogType } from "./WalletMovementLogTypeEnum"

export class WalletMovementLogFactory {
    static create(type: string, title: string, description: string, customerId: CustomerId, createdAt: Date) {
        switch (type) {
            case WalletMovementLogType.CREATE_WALLET:
                return new CreateWalletLog(customerId, createdAt)

            case WalletMovementLogType.CHARGE_WALLET:
                return new ChargeWalletLog(customerId, createdAt);

            case WalletMovementLogType.DISABLE_WALLET:
                return new DisableWalletLog(customerId, createdAt);

            case WalletMovementLogType.ENABLE_WALLET:
                return new EnableWalletLog(customerId, createdAt);

            case WalletMovementLogType.PAY_SATURDAY_JOB_WITH_WALLET:
                return new PaySaturdayJobWithWalletLog(customerId, createdAt);

            case WalletMovementLogType.PURCHASE_PLAN_WITH_WALLET:
                return new PurchasePlanWithWalletLog(customerId, createdAt);

            case WalletMovementLogType.SELECT_WALLET_AS_DEFAULT:
                return new SelectWalletAsDefaultLog(customerId, createdAt);

            default:
                throw new Error("Invalid wallet movement log type");
        }
    }
}
import { Order } from "../../domain/order/Order";
import {
    CancellationExport,
    CouponExport,
    CustomerExport,
    IExportService,
    OrdersWithRecipeSelectionExport,
    SubscriptionExport,
} from "./IExportService";
import { utils, WorkBook, WorkSheet, writeFile } from "xlsx";

export class XlsxService implements IExportService {
    public exportSubscriptions(subscriptionsExport: SubscriptionExport[]): void {
        const workbook: WorkBook = utils.book_new();
        const sheet: WorkSheet = utils.json_to_sheet(subscriptionsExport);

        utils.book_append_sheet(workbook, sheet, "Suscripciones");
        writeFile(workbook, "Suscripciones.xlsx");
    }

    public exportCustomers(customersExport: CustomerExport[]): void {
        const workbook: WorkBook = utils.book_new();
        const sheet: WorkSheet = utils.json_to_sheet(customersExport);

        utils.book_append_sheet(workbook, sheet, "Clientes");
        writeFile(workbook, "Clientes.xlsx");
    }

    public exportCancellations(cancellationExports: CancellationExport[]): void {
        throw new Error("Method not implemented.");
    }

    public exportCoupons(couponsExport: CouponExport[]): void {
        throw new Error("Method not implemented.");
    }
    public exportNextOrdersWithRecipesSelection(orders: OrdersWithRecipeSelectionExport[]): void {
        const workbook: WorkBook = utils.book_new();
        const sheet: WorkSheet = utils.json_to_sheet(orders);

        utils.book_append_sheet(workbook, sheet, "Selección recetas");
        writeFile(workbook, "Selección de recetas.xlsx");
    }
}

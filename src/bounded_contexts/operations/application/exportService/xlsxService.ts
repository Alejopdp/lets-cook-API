import { Order } from "../../domain/order/Order";
import {
    CancellationExport,
    CouponExport,
    CustomerExport,
    IExportService,
    OrdersWithRecipeSelectionExport,
    SubscriptionExport,
} from "./IExportService";
import { utils, WorkBook, WorkSheet, writeFile, readFile } from "xlsx";

export class XlsxService implements IExportService {
    public parseCsvToJson(csvFilePath: string): string[][] {
        var workbook: WorkBook = readFile(csvFilePath);
        var third_worksheet = workbook.Sheets[workbook.SheetNames[0]];

        return utils.sheet_to_json(third_worksheet, { header: 1, blankrows: false });
    }

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
        const workbook: WorkBook = utils.book_new();
        const sheet: WorkSheet = utils.json_to_sheet(couponsExport);

        utils.book_append_sheet(workbook, sheet, "Cupones");
        writeFile(workbook, "Cupones.xlsx");
    }
    public exportNextOrdersWithRecipesSelection(orders: OrdersWithRecipeSelectionExport[]): void {
        const workbook: WorkBook = utils.book_new();
        const sheet: WorkSheet = utils.json_to_sheet(orders);

        utils.book_append_sheet(workbook, sheet, "Selección recetas");
        writeFile(workbook, "Selección de recetas.xlsx");
    }
}

import { RecipeRatingExportRow } from "../../useCases/exportRecipeRatings/exportRecipeRatings";
import {
    ActionExport,
    CancellationExport,
    CouponExport,
    CustomerExport,
    IExportService,
    OrdersWithRecipeSelectionExport,
    SubscriptionExport,
} from "./IExportService";
import { utils, WorkBook, WorkSheet, writeFile, readFile } from "xlsx";

export class XlsxService implements IExportService {
    public exportCustomerActions(actionsExport: ActionExport[]): void {
        const workbook: WorkBook = utils.book_new();
        const sheet: WorkSheet = utils.json_to_sheet(actionsExport);

        utils.book_append_sheet(workbook, sheet, "Acciones");
        writeFile(workbook, "Acciones de cliente.xlsx");
    }

    public exportAllCustomersActions(actionsExport: ActionExport[]): void {
        const workbook: WorkBook = utils.book_new();
        const sheet: WorkSheet = utils.json_to_sheet(actionsExport);

        utils.book_append_sheet(workbook, sheet, "Acciones");
        writeFile(workbook, "Acciones de clientes.xlsx");
    }

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
        const workbook: WorkBook = utils.book_new();
        const sheet: WorkSheet = utils.json_to_sheet(cancellationExports);

        utils.book_append_sheet(workbook, sheet, "Cancelaciones");
        writeFile(workbook, "Cancelaciones.xlsx");
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

    public exportRecipeRatings(rows: RecipeRatingExportRow[]): void {
        const workbook: WorkBook = utils.book_new();
        const sheet: WorkSheet = utils.json_to_sheet(rows);

        utils.book_append_sheet(workbook, sheet, "Valoración de recetas");
        writeFile(workbook, "Valoración de recetas.xlsx");
    }
}

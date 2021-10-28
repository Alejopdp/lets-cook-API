import { BaseController } from "../../../../core/infra/BaseController";
import { IExportService } from "../../application/exportService/IExportService";
import { ChooseRecipesForManyOrders } from "./chooseRecipesForManyOrders";
import { ChooseRecipesForManyOrdersDto } from "./chooseRecipesForManyOrdersDto";

export class ChooseRecipesForManyOrdersController extends BaseController {
    private _chooseRecipesForManyOrders: ChooseRecipesForManyOrders;
    private _xlsxService: IExportService;

    constructor(chooseRecipesForManyOrders: ChooseRecipesForManyOrders, xlsxService: IExportService) {
        super();
        this._chooseRecipesForManyOrders = chooseRecipesForManyOrders;
        this._xlsxService = xlsxService;
        // this._chooseRecipesForManyOrdersPresenter = chooseRecipesForManyOrdersPresenter;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const filePath = this.req.file.path;
            if (!!!filePath) throw new Error("No ha ingresado ningún archivo para importar");

            const dto: ChooseRecipesForManyOrdersDto = { selection: [] };

            const matrix = this.xlsxService.parseCsvToJson(filePath);
            const orderIdSelectionMap: { [orderId: string]: { quantity: number; recipeVariantSku: string; customerEmail: string }[] } = {};

            for (let i = 0; i < matrix.length; i++) {
                const orderId = matrix[i][1];
                const actualItem = orderIdSelectionMap[orderId];

                if (!!orderId && i > 0) {
                    if (!!!actualItem) {
                        orderIdSelectionMap[orderId] = [
                            { customerEmail: matrix[i][0], recipeVariantSku: matrix[i][2], quantity: parseInt(matrix[i][3]) },
                        ];
                    } else {
                        orderIdSelectionMap[orderId].push({
                            customerEmail: matrix[i][0],
                            recipeVariantSku: matrix[i][2],
                            quantity: parseInt(matrix[i][3]),
                        });
                    }
                }
            }

            const selections: {
                orderId: string;
                recipeSelection: { quantity: number; recipeVariantSku: string; customerEmail: string }[];
                isAdminChoosing: boolean;
            }[] = [];

            for (let orderId in orderIdSelectionMap) {
                selections.push({
                    orderId,
                    recipeSelection: orderIdSelectionMap[orderId],
                    isAdminChoosing: true,
                });
            }

            dto.selection = selections;

            const { inconsistentCustomerEmails, notOwnerOfOrderCustomerEmails } = await this.chooseRecipesForManyOrders.execute(dto);

            return this.ok(this.res, { inconsistentCustomerEmails, notOwnerOfOrderCustomerEmails });
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter chooseRecipesForManyOrders
     * @return {ChooseRecipesForManyOrders
     */
    public get chooseRecipesForManyOrders(): ChooseRecipesForManyOrders {
        return this._chooseRecipesForManyOrders;
    }

    /**
     * Getter xlsxService
     * @return {IExportService}
     */
    public get xlsxService(): IExportService {
        return this._xlsxService;
    }
}

import { BaseController } from "../../../../core/infra/BaseController";
import { IExportService } from "../../application/exportService/IExportService";
import { RecipeSelection } from "../../domain/order/RecipeSelection";
import { ChooseRecipesForManyOrders } from "./chooseRecipesForManyOrders";
import { ChooseRecipesForManyOrdersDto } from "./chooseRecipesForManyOrdersDto";
import fs from "fs";

export class ChooseRecipesForManyOrdersController extends BaseController {
    private _chooseRecipesForManyOrders: ChooseRecipesForManyOrders;
    private _xlsxService: IExportService;

    constructor(chooseRecipesForManyOrders: ChooseRecipesForManyOrders, xlsxService: IExportService) {
        super();
        this._chooseRecipesForManyOrders = chooseRecipesForManyOrders;
        this._xlsxService = xlsxService;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const filePath = this.req.file.path;
            if (!!!filePath) throw new Error("No ha ingresado ningún archivo para importar");

            const dto: ChooseRecipesForManyOrdersDto = { selection: [] };

            const matrix = this.xlsxService.parseCsvToJson(filePath);
            const orderIdSelectionMap: { [orderId: string]: { quantity: number; recipeVariantSku: string; customerEmail: string }[] } = {};

            for (let i = 0; i < matrix.length; i++) {
                const orderId = matrix[i][0];
                const actualItem = orderIdSelectionMap[orderId];

                if (!!orderId && i > 0) {
                    if (!!!actualItem) {
                        orderIdSelectionMap[orderId] = [{ customerEmail: matrix[i][1], recipeVariantSku: matrix[i][4], quantity: 1 }];
                    } else {
                        if (orderIdSelectionMap[orderId].some((recipeSelection) => recipeSelection.recipeVariantSku === matrix[i][4])) {
                            orderIdSelectionMap[orderId] = orderIdSelectionMap[orderId].map((recipeSelection) => ({
                                ...recipeSelection,
                                quantity:
                                    recipeSelection.recipeVariantSku === matrix[i][4]
                                        ? recipeSelection.quantity + 1
                                        : recipeSelection.quantity,
                            }));
                        } else {
                            orderIdSelectionMap[orderId].push({
                                customerEmail: matrix[i][1],
                                recipeVariantSku: matrix[i][4],
                                quantity: 1,
                            });
                        }
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
            fs.unlinkSync(filePath);

            return this.ok(this.res, { inconsistentCustomerEmails, notOwnerOfOrderCustomerEmails });
        } catch (error: any) {
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

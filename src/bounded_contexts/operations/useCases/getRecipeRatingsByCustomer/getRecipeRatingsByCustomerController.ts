import { BaseController } from "../../../../core/infra/BaseController";
import { GetRecipeRatingsByCustomer } from "./getRecipeRatingsByCustomer";
import { GetRecipeRatingsByCustomerDto } from "./getRecipeRatingsByCustomerDto";
import { GetRecipeRatingsByCustomerPresenter } from "./getRecipeRatingsByCustomerPresenter";

export class GetRecipeRatingsByCustomerController extends BaseController {
    private _getRecipeRatingsByCustomer: GetRecipeRatingsByCustomer;
    private _getRecipeRatingsByCustomerPresenter: GetRecipeRatingsByCustomerPresenter;

    constructor(
        getRecipeRatingsByCustomer: GetRecipeRatingsByCustomer,
        getRecipeRatingsByCustomerPresenter: GetRecipeRatingsByCustomerPresenter
    ) {
        super();
        this._getRecipeRatingsByCustomer = getRecipeRatingsByCustomer;
        this._getRecipeRatingsByCustomerPresenter = getRecipeRatingsByCustomerPresenter;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetRecipeRatingsByCustomerDto = {
                customerId: this.req.params.customerId,
            };

            // const result = await this.getRecipeRatingsByCustomer.execute(dto);
            const result = this.getRecipeRatingsByCustomerPresenter.present();

            return this.ok(this.res, result);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter getRecipeRatingsByCustomer
     * @return {GetRecipeRatingsByCustomer}
     */
    public get getRecipeRatingsByCustomer(): GetRecipeRatingsByCustomer {
        return this._getRecipeRatingsByCustomer;
    }

    /**
     * Getter getRecipeRatingsByCustomerPresenter
     * @return {GetRecipeRatingsByCustomerPresenter}
     */
    public get getRecipeRatingsByCustomerPresenter(): GetRecipeRatingsByCustomerPresenter {
        return this._getRecipeRatingsByCustomerPresenter;
    }
}

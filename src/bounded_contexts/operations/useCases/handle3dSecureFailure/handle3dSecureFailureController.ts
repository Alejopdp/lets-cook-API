import { ReadStream } from "fs";
import { BaseController } from "../../../../core/infra/BaseController";
import { Month } from "../../domain/recipe/Months";
import { RecipeDifficultyLevel } from "../../domain/recipe/RecipeGeneralData/RecipeDifficultyLevel";
import { Handle3dSecureFailure } from "./handle3dSecureFailure";
import { Handle3dSecureFailureDto } from "./handle3dSecureFailureDto";
import { Address } from "../../domain/address/Address";

export class Handle3dSecureFailureController extends BaseController {
    private _handle3dSecureFailure: Handle3dSecureFailure;

    constructor(handle3dSecureFailure: Handle3dSecureFailure) {
        super();
        this._handle3dSecureFailure = handle3dSecureFailure;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: Handle3dSecureFailureDto = {
                subscriptionId: this.req.params.id,
            };

            await this.handle3dSecureFailure.execute(dto);

            return this.ok(this.res);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter handle3dSecureFailureBilling
     * @return {Handle3dSecureFailure}
     */
    public get handle3dSecureFailure(): Handle3dSecureFailure {
        return this._handle3dSecureFailure;
    }
}

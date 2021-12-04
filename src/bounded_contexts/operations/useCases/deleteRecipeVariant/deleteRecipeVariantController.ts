import { BaseController } from "../../../../core/infra/BaseController";
import fs from "fs";
import { DeleteRecipeVariant } from "./deleteRecipeVariant";
import { DeleteRecipeVariantDto } from "./deleteRecipeVariantDto";
import { Locale } from "../../domain/locale/Locale";

export class DeleteRecipeVariantController extends BaseController {
    private _deleteRecipeVariant: DeleteRecipeVariant;

    constructor(deleteRecipeVariant: DeleteRecipeVariant) {
        super();
        this._deleteRecipeVariant = deleteRecipeVariant;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: DeleteRecipeVariantDto = { recipeVariantSku: this.req.params.variantSku, locale: Locale.es };

            await this.deleteRecipeVariant.execute(dto);

            return this.ok(this.res);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter deleteRecipeVariant
     * @return {DeleteRecipeVariant}
     */
    public get deleteRecipeVariant(): DeleteRecipeVariant {
        return this._deleteRecipeVariant;
    }
}

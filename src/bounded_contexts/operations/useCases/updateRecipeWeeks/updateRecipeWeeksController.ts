import { logger } from "../../../../../config";
import { BaseController } from "../../../../core/infra/BaseController";
import { UpdateRecipeWeeks } from "./updateRecipeWeeks";
import { UpdateRecipeWeeksDto } from "./updateRecipeWeeksDto";

export class UpdateRecipeWeeksController extends BaseController {
    public _updateRecipeWeeks: UpdateRecipeWeeks;

    constructor(updateRecipeWeeks: UpdateRecipeWeeks) {
        super();
        this._updateRecipeWeeks = updateRecipeWeeks;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: UpdateRecipeWeeksDto = {
                recipeId: this.req.params.id,
                weeksIds: this.req.body.weeksIds,
            };

            await this.updateRecipeWeeks.execute(dto);

            return this.ok(this.res);
        } catch (error: any) {
            return this.fail(error);
        }
    }

    /**
     * Getter UpdateRecipeWeeks
     * @return {UpdateRecipeWeeks}
     */
    public get updateRecipeWeeks(): UpdateRecipeWeeks {
        return this._updateRecipeWeeks;
    }
}

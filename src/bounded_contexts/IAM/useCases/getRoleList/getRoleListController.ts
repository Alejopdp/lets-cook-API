import { BaseController } from "../../../../core/infra/BaseController";
import { GetRoleList } from "./getRoleList";

export class GetRoleListController extends BaseController {
    private _useCase: GetRoleList;

    constructor(useCase: GetRoleList) {
        super();
        this._useCase = useCase;
    }

    async executeImpl(): Promise<any> {
        try {
            const result = await this.useCase.execute();

            return this.ok(this.res, result);
        } catch (err) {
            return this.fail(err);
        }
    }

    /**
     * Getter useCase
     * @return {GetRoleList}
     */
    public get useCase(): GetRoleList {
        return this._useCase;
    }
}

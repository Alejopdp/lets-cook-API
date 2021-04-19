import { logger } from "../../../../../config";
import { BaseController } from "../../../../core/infra/BaseController";
import { Permission } from "../../domain/permission/Permission";
import { CreateRole } from "./createRole";
import { CreateRoleDto } from "./createRoleDto";

export class CreateRoleController extends BaseController {
    private useCase: CreateRole;

    constructor(useCase: CreateRole) {
        super();
        this.useCase = useCase;
    }

    async executeImpl(): Promise<any> {
        try {
            const dto: CreateRoleDto = {
                permissions: this.req.body.permissions
                    .map((permission: string) => (<any>Permission)[permission])
                    .filter((permission: any) => permission),
                title: this.req.body.title,
            };

            await this.useCase.execute(dto);

            return this.ok(this.res);
        } catch (err) {
            return this.fail(err);
        }
    }
}

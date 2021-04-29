import { BaseController } from "../../../../core/infra/BaseController";
import { CreateUserAsAdmin } from "./createUserAsAdmin";
import { CreateUserAsAdminDto } from "./createUserAsAdminDto";

export class CreateUserAsAdminController extends BaseController {
    private useCase: CreateUserAsAdmin;

    constructor(useCase: CreateUserAsAdmin) {
        super();
        this.useCase = useCase;
    }

    async executeImpl(): Promise<any> {
        try {
            const dto: CreateUserAsAdminDto = {
                email: this.req.body.email,
                firstName: this.req.body.firstName,
                lastName: this.req.body.lastName,
                roleTitle: this.req.body.role,
            };

            await this.useCase.execute(dto);

            return this.ok(this.res);
        } catch (err) {
            return this.fail(err);
        }
    }
}

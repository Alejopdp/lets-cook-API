import { BaseController } from "../../../../core/infra/BaseController";
import { DeleteUser } from "./deleteUser";
import { DeleteUserDto } from "./deleteUserDto";

export class DeleteUserController extends BaseController {
    private _deleteUser: DeleteUser;

    constructor(deleteUser: DeleteUser) {
        super();
        this._deleteUser = deleteUser;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: DeleteUserDto = {
                id: parseInt(this.req.params.id),
            };

            await this.deleteUser.execute(dto);

            return this.ok(this.res);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter deleteUser
     * @return {DeleteUser}
     */
    public get deleteUser(): DeleteUser {
        return this._deleteUser;
    }
}

import { BaseController } from "../../../../core/infra/BaseController";
import { Either, Failure } from "../../../../core/logic/Result";
import { DeleteUser } from "./deleteUser";
import { DeleteUserDto } from "./deleteUserDto";

export class DeleteUserController extends BaseController {
    private _deleteUser: DeleteUser;

    constructor(deleteUser: DeleteUser) {
        super();
        this._deleteUser = deleteUser;
    }

    async executeImpl(): Promise<any> {
        try {
            const dto: DeleteUserDto = {
                id: this.req.params.id,
            };

            await this.deleteUser.execute(dto);

            return this.ok(this.res);
        } catch (err) {
            return this.fail(err);
        }
    }

    /**
     * Getter DeleteUser
     * @return {DeleteUser}
     */
    public get deleteUser(): DeleteUser {
        return this._deleteUser;
    }
}

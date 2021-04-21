import { BaseController } from "../../../../core/infra/BaseController";
import { GetAllUsers } from "./getAllUsers";
import { GetAllUsersDto } from "./getAllUsersDto";

export class GetAllUsersController extends BaseController {
    private _getAllUsers: GetAllUsers;

    constructor(getAllUsers: GetAllUsers) {
        super();
        this._getAllUsers = getAllUsers;
    }

    async executeImpl(): Promise<any> {
        try {
            const dto: GetAllUsersDto = {
                id: parseInt(this.req.params.id),
            };

            const result = await this.getAllUsers.execute(dto);

            return this.ok(this.res, result);
        } catch (err) {
            return this.fail(err);
        }
    }

    /**
     * Getter getAllUsers
     * @return {GetAllUsers}
     */
    public get getAllUsers(): GetAllUsers {
        return this._getAllUsers;
    }
}

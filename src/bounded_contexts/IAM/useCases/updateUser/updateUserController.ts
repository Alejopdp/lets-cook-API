import { BaseController } from "../../../../core/infra/BaseController";
import { Either, Failure } from "../../../../core/logic/Result";
import { UpdateUser } from "./updateUser";
import { UpdateUserDto } from "./updateUserDto";
import { UpdateUserErrors } from "./updateUserErrors";

export class UpdateUserController extends BaseController {
    private _updateUser: UpdateUser;

    constructor(updateUser: UpdateUser) {
        super();
        this._updateUser = updateUser;
    }

    async executeImpl(): Promise<any> {
        try {
            const dto: UpdateUserDto = {
                id: parseInt(this.req.params.id),
                firstName: this.req.body.firstName,
                lastName: this.req.body.lastName,
                roleTitle: this.req.body.roleTitle,
            };

            const result: Either<Failure<UpdateUserErrors>, any> = await this.updateUser.execute(dto);

            if (result.isLeft()) {
                const error = result.value;

                switch (error.type) {
                    case UpdateUserErrors.InvalidArguments:
                        return this.clientError(error.reason);
                    case UpdateUserErrors.InvalidUser:
                        return this.clientError(error.reason);
                    default:
                        return this.fail(error.reason);
                }
            }

            return this.ok(this.res, result.value);
        } catch (err) {
            return this.fail(err);
        }
    }

    /**
     * Getter updateUser
     * @return {updateUser}
     */
    public get updateUser(): UpdateUser {
        return this._updateUser;
    }
}

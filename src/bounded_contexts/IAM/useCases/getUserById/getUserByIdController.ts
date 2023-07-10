import { BaseController } from "../../../../core/infra/BaseController";
import { Either, Failure } from "../../../../core/logic/Result";
import { GetUserById } from "./getUserById";
import { GetUserByIdDto } from "./getUserByIdDto";
import { GetUserByIdErrors } from "./getUserByIdErrors";

export class GetUserByIdController extends BaseController {
    private _getUserById: GetUserById;

    constructor(getUserById: GetUserById) {
        super();
        this._getUserById = getUserById;
    }

    async executeImpl(): Promise<any> {
        try {
            const dto: GetUserByIdDto = {
                id: this.req.params.id,
            };

            const result: Either<Failure<GetUserByIdErrors>, any> = await this.getUserById.execute(dto);

            if (result.isLeft()) {
                const error = result.value;

                switch (error.type) {
                    case GetUserByIdErrors.InvalidArguments:
                        return this.clientError(error.reason);
                    default:
                        return this.fail(error.reason);
                }
            }

            return this.ok(this.res, result.value);
        } catch (err: any) {
            return this.fail(err);
        }
    }

    /**
     * Getter getUserById
     * @return {GetUserById}
     */
    public get getUserById(): GetUserById {
        return this._getUserById;
    }
}

import { logger } from "../../../../../config";
import { BaseController } from "../../../../core/infra/BaseController";
import { GetDataForGeneratingPassword } from "./getDataForGeneratingPassword";
import { GetDataForGeneratingPasswordDto } from "./getDataForGeneratingPasswordDto";

export class GetDataForGeneratingPasswordController extends BaseController {
    private useCase: GetDataForGeneratingPassword;

    constructor(useCase: GetDataForGeneratingPassword) {
        super();
        this.useCase = useCase;
    }

    async executeImpl(): Promise<any> {
        try {
            const dto: GetDataForGeneratingPasswordDto = {
                //@ts-ignore TO DO: Sacar el ts ignore
                email: this.req.decode!.email,
            };

            logger.warn(dto.email);

            const result = await this.useCase.execute(dto);

            return this.ok(this.res, result);
        } catch (err: any) {
            return this.fail(err);
        }
    }
}

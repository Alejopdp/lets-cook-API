import { BaseController } from "../../../../core/infra/BaseController";
import { GetShippingZoneById } from "./getShippingZoneById";
import { GetShippingZoneByIdDto } from "./getShippingZoneByIdDto";

export class GetShippingZoneByIdController extends BaseController {
    private _getShippingZoneById: GetShippingZoneById;

    constructor(getShippingZoneById: GetShippingZoneById) {
        super();
        this._getShippingZoneById = getShippingZoneById;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetShippingZoneByIdDto = {
                id: this.req.params.id,
            };
            const result = await this.getShippingZoneById.execute(dto);

            return this.ok(this.res, result);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter getShippingZoneById
     * @return {GetShippingZoneById}
     */
    public get getShippingZoneById(): GetShippingZoneById {
        return this._getShippingZoneById;
    }
}

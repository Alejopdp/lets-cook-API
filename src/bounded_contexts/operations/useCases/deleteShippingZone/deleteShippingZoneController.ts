import { BaseController } from "../../../../core/infra/BaseController";
import { DeleteShippingZone } from "./deleteShippingZone";
import { DeleteShippingZoneDto } from "./deleteShippingZoneDto";

export class DeleteShippingZoneController extends BaseController {
    private _deleteShippingZone: DeleteShippingZone;

    constructor(deleteShippingZone: DeleteShippingZone) {
        super();
        this._deleteShippingZone = deleteShippingZone;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: DeleteShippingZoneDto = {
                shippingId: this.req.params.id,
            };

            await this.deleteShippingZone.execute(dto);

            return this.ok(this.res);
        } catch (error: any) {
            return this.fail(error);
        }
    }

    /**
     * Getter deleteShippingZone
     * @return {DeleteShippingZone}
     */
    public get deleteShippingZone(): DeleteShippingZone {
        return this._deleteShippingZone;
    }
}

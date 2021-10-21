import { ReadStream } from "fs";
import { BaseController } from "../../../../core/infra/BaseController";
import { UpdateShippingZone } from "./updateShippingZone";
import { UpdateShippingZoneDto } from "./updateShippingZoneDto";
import fs from "fs";

var tj = require("@mapbox/togeojson");
const DOMParser = require("xmldom").DOMParser;

export class UpdateShippingZoneController extends BaseController {
    private _updateShippingZone: UpdateShippingZone;

    constructor(updateShippingZone: UpdateShippingZone) {
        super();
        this._updateShippingZone = updateShippingZone;
    }

    protected async executeImpl(): Promise<any> {
        try {
            var coordinates = [];

            if (!!this.req.file) {
                const shippingZoneKmlPath = this.req.file.path;
                var kml = new DOMParser().parseFromString(fs.readFileSync(shippingZoneKmlPath, "utf8"));
                var converted = tj.kml(kml);
                let polygonFilter = [];

                if (converted.features && converted.features.length > 0) {
                    polygonFilter = converted.features.filter((val: any) => val.properties.name === this.req.body.reference);
                }
                if (polygonFilter.length > 1) throw new Error("No debe haber más de un polígono con el mismo nombre");
                if (polygonFilter.length === 0) throw new Error("No existen zonas de envio");
                if (polygonFilter.length === 1) coordinates = converted.features[0].geometry.coordinates[0];
            }

            const dto: UpdateShippingZoneDto = {
                id: this.req.params.id,
                name: this.req.body.name,
                reference: this.req.body.reference,
                cost: parseFloat(this.req.body.cost),
                state: this.req.body.state,
                radio: coordinates,
                day: this.req.body.shippingDayOfWeek,
            };

            await this.updateShippingZone.execute(dto);

            return this.ok(this.res);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter updateShippingZone
     * @return {UpdateShippingZone}
     */
    public get updateShippingZone(): UpdateShippingZone {
        return this._updateShippingZone;
    }
}

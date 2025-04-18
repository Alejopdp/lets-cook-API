import { BaseController } from "../../../../core/infra/BaseController";
import { UpdateShippingZone } from "./updateShippingZone";
import { UpdateShippingZoneDto } from "./updateShippingZoneDto";
import fs from "fs";

var tj = require("@tmcw/togeojson");
const DOMParser = require("xmldom").DOMParser;

export class UpdateShippingZoneController extends BaseController {
    private _updateShippingZone: UpdateShippingZone;

    constructor(updateShippingZone: UpdateShippingZone) {
        super();
        this._updateShippingZone = updateShippingZone;
    }

    protected async executeImpl(): Promise<any> {
        try {
            var coordinates: any[] = [];

            if (!!this.req.file) {
                const shippingZoneKmlPath = this.req.file.path;
                var kml = new DOMParser().parseFromString(fs.readFileSync(shippingZoneKmlPath, "utf8"));
                var converted = tj.kml(kml);
                let polygonFilter = [];

                if (converted.features && converted.features.length > 0) {
                    polygonFilter = converted.features.filter((val: any) => val.properties.name === this.req.body.reference);
                }
                if (polygonFilter.length > 1) throw new Error("No debe haber más de un polígono con el mismo nombre");
                if (polygonFilter.length === 0) throw new Error("Ninguno de los polígonos coinciden con el nombre de referencia ingresado");
                if (polygonFilter.length === 1) coordinates = converted.features[0].geometry.coordinates[0];
            }

            const dto: UpdateShippingZoneDto = {
                id: this.req.params.id,
                name: this.req.body.name,
                reference: this.req.body.reference,
                cost: parseFloat(this.req.body.cost),
                state: this.req.body.state,
                radio: coordinates,
                day: parseInt(this.req.body.shippingDayOfWeek),
                queryDate: new Date(),
            };

            await this.updateShippingZone.execute(dto);

            return this.ok(this.res);
        } catch (error: any) {
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

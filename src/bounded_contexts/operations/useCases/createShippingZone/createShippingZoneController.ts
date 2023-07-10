import { BaseController } from "../../../../core/infra/BaseController";
import { CreateShippingZoneDto } from "./createShippingZoneDto";
import fs from "fs";
import { CreateShippingZone } from "./createShippingZone";
import { logger } from "../../../../../config";
// import { kml } from '@mapbox/togeojson';
var tj = require("@mapbox/togeojson");
const DOMParser = require("xmldom").DOMParser;

export class CreateShippingZoneController extends BaseController {
    private _createShippingZone: CreateShippingZone;

    constructor(createShippingZone: CreateShippingZone) {
        super();
        this._createShippingZone = createShippingZone;
    }

    protected async executeImpl(): Promise<any> {
        try {
            if (!this.req.file) throw new Error("No ha ingresado un archivo kml");
            const shippingZoneKmlPath = this.req.file.path;
            var kml = new DOMParser().parseFromString(fs.readFileSync(shippingZoneKmlPath, "utf8"));
            var converted = tj.kml(kml);

            let polygonFilter = [],
                coordinates = [];
            if (converted.features && converted.features.length > 0) {
                polygonFilter = converted.features.filter((val: any) => val.properties.name === this.req.body.reference);
            }

            logger.warn(``);
            if (polygonFilter.length > 1) throw new Error("No debe haber más de un polígono con el mismo nombre");
            if (polygonFilter.length === 0) throw new Error("Ninguno de los polígonos coinciden con el nombre de referencia ingresado");
            if (polygonFilter.length === 1) coordinates = converted.features[0].geometry.coordinates[0];

            const dto: CreateShippingZoneDto = {
                name: this.req.body.name,
                reference: this.req.body.reference,
                cost: parseFloat(this.req.body.cost),
                state: "active",
                radio: coordinates,
                shippingDayOfWeek: this.req.body.shippingDayOfWeek || 3,
            };

            await this.createShippingZone.execute(dto);

            // fs.unlinkSync(planImagePath);

            return this.ok(this.res);
        } catch (error: any) {
            return this.fail(error);
        }
    }

    /**
     * Getter createShippingZone
     * @return {CreateShippingZone}
     */
    public get createShippingZone(): CreateShippingZone {
        return this._createShippingZone;
    }
}

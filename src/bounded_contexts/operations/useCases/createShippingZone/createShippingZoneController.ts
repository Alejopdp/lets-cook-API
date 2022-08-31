import { BaseController } from "../../../../core/infra/BaseController";
import { CreateShippingZoneDto } from "./createShippingZoneDto";
import fs from "fs";
import { CreateShippingZone } from "./createShippingZone";
import { FeatureCollection, Geometry, GeoJsonProperties } from "geojson"
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
            var geoJson: FeatureCollection<Geometry, GeoJsonProperties> = tj.kml(kml);
            const polygonsQty = geoJson.features?.filter(feat => feat.geometry.type === "Polygon").length ?? 0

            if (polygonsQty < 1) throw new Error("No has ingresado ningun poligono dentro del archivo")
            if (polygonsQty > 1) throw new Error("Ingresaste mas de 1 poligono, solo debes ingresar 1")

            const polygon: Geometry | undefined = geoJson.features.find(feat => feat.properties?.name === this.req.body.reference)?.geometry
            if (!polygon) throw new Error("Ninguno de los polígonos coinciden con el nombre de referencia ingresado");

            let coordinates = [];
            //@ts-ignore
            coordinates = polygon.coordinates?.[0];

            if (!coordinates) throw new Error("No se pudieron obtener las coordenadas")

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
        } catch (error) {
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

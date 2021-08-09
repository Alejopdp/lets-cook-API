import { Day } from "../src/bounded_contexts/operations/domain/day/Day";
import { ShippingZone } from "../src/bounded_contexts/operations/domain/shipping/ShippingZone";
import { Coordinates } from "../src/bounded_contexts/operations/domain/shipping/ShippingZoneRadio/Coordinates";
import { ShippingZoneRadio } from "../src/bounded_contexts/operations/domain/shipping/ShippingZoneRadio/ShippingZoneRadio";

const tuesday: Day = new Day(2);
const barcelonaCoordinates = [
    new Coordinates(42.5609185, 0.378277),
    new Coordinates(40.9215535, -0.5665473),
    new Coordinates(40.722021, 1.1253473),
    new Coordinates(41.9265463, 3.1028863),
    new Coordinates(42.5609185, 0.378277),
];
const barcelonaRadio = new ShippingZoneRadio(barcelonaCoordinates);
const barcelonaShippingZone = ShippingZone.create("Barcelona", "Polígono 1", 50, "active", barcelonaRadio, tuesday);

const valenciaCoordinates = [
    new Coordinates(40.3608234, -1.1260262),
    new Coordinates(38.9739776, -2.2246591),
    new Coordinates(38.4596587, -0.6426278),
    new Coordinates(39.9578008, 0.8954581),
    new Coordinates(40.3608234, -1.1260262),
];
const valenciaRadio = new ShippingZoneRadio(valenciaCoordinates);
const wednesday: Day = new Day(3);
const valenciaShippingZone = ShippingZone.create("Valencia", "Polígono 1", 200, "active", valenciaRadio, wednesday);

export const shippingZones = [barcelonaShippingZone, valenciaShippingZone];

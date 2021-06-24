import { logger } from "../../../../../config";
import { IStorageService } from "../../application/storageService/IStorageService";
import { ShippingZone } from "../../domain/shipping/ShippingZone";
import { IShippingZoneRepository } from "../../infra/repositories/shipping/IShippingZoneRepository";
import { GetShippingRateDto } from "./getShippingRateDto";
import { GetShippingListPresenter } from "./getShippingZoneListPresenter";
var pointInPolygon = require('point-in-polygon');

export class GetShippingRate {
    private _shippingRepository: IShippingZoneRepository;
    private _storageService: IStorageService;

    constructor(shippingRepository: IShippingZoneRepository, storageService: IStorageService) {
        this._shippingRepository = shippingRepository;
        this._storageService = storageService;
    }

    public async execute(dto: GetShippingRateDto): Promise<number> {
        var shippings: ShippingZone[] = await this.shippingRepository.findAll();
        
        let list =  GetShippingListPresenter.present(shippings);
        
        let polygons = list.map((val: any) => {
            let aux = val;
            let array = aux.radio.map((value: any) => {
                let aux_point = [value.latitude, value.longitude]
                return aux_point;
            });
            aux.radio = array;
            return aux;
        });
        // console.log("Polygon: ", polygons, "Point: ", dto.coordinates)

        let rate: number = 0;
        
        for(let i: number = 0; i < polygons.length; i++) {
            if(pointInPolygon(dto.coordinates, polygons[i].radio)) {
                rate = polygons[i]['cost'];
            }
        }
        
        return rate
    }

    /**
     * Getter shippingRepository
     * @return {IShippingZoneRepository}
     */
    public get shippingRepository(): IShippingZoneRepository {
        return this._shippingRepository;
    }

    /**
     * Getter storageService
     * @return {IStorageService}
     */
    public get storageService(): IStorageService {
        return this._storageService;
    }
}

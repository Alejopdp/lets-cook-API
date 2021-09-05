import _ from "lodash";
import { ShippingZone } from "../../domain/shipping/ShippingZone";
import { Week } from "../../domain/week/Week";
import { IShippingZoneRepository } from "../../infra/repositories/shipping/IShippingZoneRepository";
import { IWeekRepository } from "../../infra/repositories/week/IWeekRepository";
import { GetNextOrdersWithRecipesSelectionExportFiltersDto } from "./getNextOrdersWithRecipesSelectionExportFiltersDto";

export class GetNextOrdersWithRecipesSelectionExportFilters {
    private _weekRepository: IWeekRepository;
    private _shippingZoneRepository: IShippingZoneRepository;

    constructor(weekRepository: IWeekRepository, shippingZoneRepository: IShippingZoneRepository) {
        this._weekRepository = weekRepository;
        this._shippingZoneRepository = shippingZoneRepository;
    }

    public async execute(
        dto: GetNextOrdersWithRecipesSelectionExportFiltersDto
    ): Promise<{ weeks: Week[]; shippingDates: Date[]; billingDates: Date[] }> {
        const weeks: Week[] = await this.weekRepository.findLastAndNextEight();
        var shippingZones: ShippingZone[] = await this.shippingZoneRepository.findAll();
        var shippingDayNumbers: number[] = [];
        var thisWeekShippingDays: Date[] = [];
        var shippingDates: Date[] = [];
        var billingDates: Date[] = [];

        shippingZones = _.orderBy(shippingZones, ["getDayNumberOfWeek"], "asc");

        for (let shippingZone of shippingZones) {
            if (shippingDayNumbers[0] !== shippingZone.getDayNumberOfWeek()) {
                const dayNumber = shippingZone.getDayNumberOfWeek();
                const thisWeekDay = new Date();
                const differenceInDays = dayNumber - thisWeekDay.getDay();

                thisWeekDay.setDate(thisWeekDay.getDate() + differenceInDays);
                thisWeekShippingDays = [...thisWeekShippingDays, thisWeekDay];
                shippingDayNumbers = [dayNumber, ...shippingDayNumbers];
            }
        }

        for (let date of thisWeekShippingDays) {
            const startDate = new Date(date);

            startDate.setDate(date.getDate() - 7 * 8);
            for (let i = 0; i < 16; i++) {
                shippingDates.push(new Date(startDate));
                startDate.setDate(startDate.getDate() + 7);
            }
        }

        const billingStartDate = new Date();
        billingStartDate.setDate(billingStartDate.getDate() + (6 - billingStartDate.getDay()) - 7 * 8);

        for (let i = 0; i < 16; i++) {
            billingDates.push(new Date(billingStartDate));
            billingStartDate.setDate(billingStartDate.getDate() + 7);
        }

        return { weeks, shippingDates, billingDates };
    }

    /**
     * Getter weekRepository
     * @return {IWeekRepository}
     */
    public get weekRepository(): IWeekRepository {
        return this._weekRepository;
    }

    /**
     * Getter weekRepository
     * @return {IWeekRepository}
     */
    public get shippingZoneRepository(): IShippingZoneRepository {
        return this._shippingZoneRepository;
    }
}

import { Week } from "../../domain/week/Week";
import { IWeekRepository } from "../../infra/repositories/week/IWeekRepository";
import { GetNextOrdersWithRecipesSelectionExportFiltersDto } from "./getNextOrdersWithRecipesSelectionExportFiltersDto";

export class GetNextOrdersWithRecipesSelectionExportFilters {
    private _weekRepository: IWeekRepository;

    constructor(weekRepository: IWeekRepository) {
        this._weekRepository = weekRepository;
    }

    public async execute(dto: GetNextOrdersWithRecipesSelectionExportFiltersDto): Promise<{ weeks: Week[] }> {
        const weeks: Week[] = await this.weekRepository.findLastAndNextEight();

        return { weeks };
    }

    /**
     * Getter weekRepository
     * @return {IWeekRepository}
     */
    public get weekRepository(): IWeekRepository {
        return this._weekRepository;
    }
}

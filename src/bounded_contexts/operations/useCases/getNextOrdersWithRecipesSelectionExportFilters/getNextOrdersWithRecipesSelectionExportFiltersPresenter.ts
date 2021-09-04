import { Week } from "../../domain/week/Week";

export class GetNextOrdersWithRecipesSelectionExportFiltersPresenter {
    public present({ weeks }: { weeks: Week[] }): any {
        return { weeks: this.presentWeeks(weeks) };
    }

    private presentWeeks(weeks: Week[]): { id: string | number; label: string }[] {
        return weeks.map((week) => ({
            id: week.id.value,
            label: week.getShorterLabel(),
        }));
    }
}

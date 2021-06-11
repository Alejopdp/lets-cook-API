import { Week } from "../src/bounded_contexts/operations/domain/week/Week";

export const getArrayOfFutureWeeks = () => {
    const weeks: Week[] = [];

    for (let i = 0; i < 1000; i++) {
        const startDateTuesday = new Date(2021, 5, 16);
        const endDateMonday = new Date(2021, 5, 22);

        startDateTuesday.setDate(startDateTuesday.getDate() + 7 * i);
        endDateMonday.setDate(endDateMonday.getDate() + 7 * i);
        weeks.push(new Week(startDateTuesday, endDateMonday));
    }

    return weeks;
};

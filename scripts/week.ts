import { Week } from "../src/bounded_contexts/operations/domain/week/Week";

export const getArrayOfFutureWeeks = () => {
    const weeks: Week[] = [];

    for (let i = 0; i < 1000; i++) {
        const startDateMonday = new Date(2021, 6, 12);
        const endDateSunday = new Date(2021, 6, 19);

        startDateMonday.setDate(startDateMonday.getDate() + 7 * i);
        startDateMonday.setHours(2);
        endDateSunday.setDate(endDateSunday.getDate() + 7 * i);
        endDateSunday.setHours(1, 59);
        weeks.push(Week.create(startDateMonday, endDateSunday));
    }

    return weeks;
};

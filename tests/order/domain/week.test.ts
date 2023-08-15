import { Week } from "../../../src/bounded_contexts/operations/domain/week/Week";

const WEEK_14_AGO_2023 = new Week(new Date('2023-08-14'), new Date('2023-08-20'));

describe('Week', () => {
    describe("Starts after a week from 2 weeks ago", () => {
        it('should return false if the week starts after a week from the given date', () => {
            const date = new Date('2023-08-06');
            expect(WEEK_14_AGO_2023.startsAfterAWeekFrom(date)).toBe(false);
        });
    });

    describe("Starts after a week from a date way back in the past", () => {
        it('should return false if the week starts after a week from the given date', () => {
            const date = new Date('2023-02-06');
            expect(WEEK_14_AGO_2023.startsAfterAWeekFrom(date)).toBe(false);
        });
    });


    describe('Starts after a week from monday', () => {
        it('should return true if the week starts after a week from the given date', () => {
            const date = new Date('2023-08-07');
            expect(WEEK_14_AGO_2023.startsAfterAWeekFrom(date)).toBe(true);
        });
    });

    describe('Starts after a week from tuesday', () => {
        it('should return true if the week starts after a week from the given date', () => {
            const date = new Date('2023-08-08');
            expect(WEEK_14_AGO_2023.startsAfterAWeekFrom(date)).toBe(true);
        });
    });

    describe('Starts after a week from wednesday', () => {
        it('should return true if the week starts after a week from the given date', () => {
            const date = new Date('2023-08-09');
            expect(WEEK_14_AGO_2023.startsAfterAWeekFrom(date)).toBe(true);
        });
    });

    describe('Starts after a week from thursday', () => {
        it('should return true if the week starts after a week from the given date', () => {
            const date = new Date('2023-08-10');
            expect(WEEK_14_AGO_2023.startsAfterAWeekFrom(date)).toBe(true);
        });
    });

    describe('Starts after a week from friday', () => {
        it('should return true if the week starts after a week from the given date', () => {
            const date = new Date('2023-08-11');
            expect(WEEK_14_AGO_2023.startsAfterAWeekFrom(date)).toBe(true);
        });
    });

    describe('Starts after a week from saturday', () => {
        it('should return true if the week starts after a week from the given date', () => {
            const date = new Date('2023-08-12');
            expect(WEEK_14_AGO_2023.startsAfterAWeekFrom(date)).toBe(true);
        });
    });

    describe('Starts after a week from sunday', () => {
        it('should return true if the week starts after a week from the given date', () => {
            const date = new Date('2023-08-13');
            expect(WEEK_14_AGO_2023.startsAfterAWeekFrom(date)).toBe(true);
        });


    });
});



describe('Week', () => {
    describe("Starts the week after (+2) from sunday", () => {
        it('should return true if the week starts after a week from the given date', () => {
            const date = new Date('2023-08-06');
            const shipping_date = new Date('2023-08-14');
            expect(WEEK_14_AGO_2023.startsTheWeekAfter(date, shipping_date)).toBe(true);
        });
    });

});


import { MomentTimeService } from "../../application/timeService/momentTimeService";
import { Customer } from "../../domain/customer/Customer";
import { Week } from "../../domain/week/Week";

interface FilterOption {
    value: string | number | Date;
    label: string;
}
export class GetNextOrdersWithRecipesSelectionExportFiltersPresenter {
    public present({
        weeks,
        shippingDates,
        billingDates,
        customers,
    }: {
        weeks: Week[];
        shippingDates: Date[];
        billingDates: Date[];
        customers: Customer[];
    }): any {
        return {
            weeks: this.presentWeeks(weeks),
            shippingDates: this.presentDates(shippingDates).sort((date1, date2) => (date1.value > date2.value ? 1 : -1)),
            billingDates: this.presentDates(billingDates).sort((date1, date2) => (date1.value > date2.value ? 1 : -1)),
            customers: this.presentCustomers(customers).sort((customer1, customer2) =>
                customer1.value > customer2.value || customer2.value ? 1 : -1
            ),
        };
    }

    private presentWeeks(weeks: Week[]): FilterOption[] {
        return weeks.map((week) => ({
            value: week.id.value,
            label: week.getShorterLabel(),
            minDay: week.minDay
        })).sort((week1, week2) => (week1.minDay.getTime() > week2.minDay.getTime() ? 1 : -1));
    }

    private presentDates(dates: Date[]): FilterOption[] {
        return dates.map((date) => ({
            value: date,
            label: MomentTimeService.getDddDdMmmm(date),
        }));
    }

    private presentCustomers(customers: Customer[]): FilterOption[] {
        const sortedCustomers = customers.sort((customer1, customer2) =>
            !!!customer2.personalInfo?.name ||
                (!!customer1.personalInfo?.name && customer1.personalInfo?.name.toLowerCase() > customer2.personalInfo?.name.toLowerCase())
                ? 1
                : -1
        );
        return sortedCustomers.map((customer) => ({
            value: customer.id.value,
            label: customer.getFullNameOrEmail(),
        }));
    }
}

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
            customers: this.presentCustomers(customers),
        };
    }

    private presentWeeks(weeks: Week[]): FilterOption[] {
        return weeks.map((week) => ({
            value: week.id.value,
            label: week.getShorterLabel(),
        }));
    }

    private presentDates(dates: Date[]): FilterOption[] {
        return dates.map((date) => ({
            value: date,
            label: MomentTimeService.getDddDdMmmm(date),
        }));
    }

    private presentCustomers(customers: Customer[]): FilterOption[] {
        return customers.map((customer) => ({
            value: customer.id.value,
            label: customer.getFullNameOrEmail(),
        }));
    }
}

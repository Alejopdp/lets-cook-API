import { Customer } from "@src/bounded_contexts/operations/domain/customer/Customer";
import { CustomerId } from "@src/bounded_contexts/operations/domain/customer/CustomerId";
import { Week } from "@src/bounded_contexts/operations/domain/week/Week";
import { ICustomerRepository } from "./ICustomerRepository";

export class InMemoryCustomerRepository implements ICustomerRepository {
    private customers: Customer[] = [];

    public constructor(customers: Customer[]) {
        this.customers = customers;
    }

    public async findBy(conditions: any): Promise<Customer[]> {
        throw new Error("Method not implemented.");
    }

    public async save(customer: Customer): Promise<void> {
        const customerIndex = this.customers.findIndex((c) => c.id.equals(customer.id));
        if (customerIndex !== -1) {
            this.customers[customerIndex] = customer;
            return;
        }
        else {
            this.customers.push(customer);
            return;
        }


    }

    public async findAllWithWalletEnabled(): Promise<Customer[]> {
        return this.customers.filter((customer) => customer.wallet?.isEnabled);
    }

    public async findByEmail(email: string): Promise<any | undefined> {
        return this.customers.find((customer) => customer.email === email);
    }

    public async isEmailVerified(email: string): Promise<boolean> {
        return this.customers.some((customer) => customer.email === email);
    }

    public async findById(id: CustomerId): Promise<Customer | undefined> {
        return this.customers.find((customer) => customer.id.equals(id));
    }

    public async findByIdList(ids: any[]): Promise<any[]> {
        return this.customers.filter((customer) => ids.includes(customer.id));
    }

    public async findAll(): Promise<any[]> {
        return this.customers;
    }

    public async findByName(name: string): Promise<any[]> {
        return this.customers.filter((customer) => customer.getPersonalInfo().fullName === name);
    }

    public async updateMany(customers: Customer[]): Promise<void> {
        for (const customer of customers) {
            await this.save(customer);
        }
    }
    public async findByIdOrThrow(id: CustomerId): Promise<Customer> {
        const customer = await this.findById(id);
        if (!customer) throw new Error("Customer not found");
        return customer;
    }
    countActiveCustomersByWeek(week: Week): Promise<number> {
        throw new Error("Method not implemented.");
    }
    countNewCustomersByWeek(week: Week): Promise<number> {
        throw new Error("Method not implemented.");
    }
    public async countCustomersWithFriendCode(): Promise<number> {
        return this.customers.filter((customer) => customer.friendCode !== undefined).length;
    }
    countNewLeadsByWeek(week: Week): Promise<number> {
        throw new Error("Method not implemented.");
    }
    delete(customerId: CustomerId): void {
        throw new Error("Method not implemented.");
    }

}
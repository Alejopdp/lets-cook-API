import { Customer } from "@src/bounded_contexts/operations/domain/customer/Customer";
import { CustomerId } from "@src/bounded_contexts/operations/domain/customer/CustomerId";
import { Week } from "@src/bounded_contexts/operations/domain/week/Week";
import { ICustomerRepository } from "./ICustomerRepository";

export class InMemoryCustomerRepository implements ICustomerRepository {
    updateMany(customers: Customer[]): Promise<void> {
        throw new Error("Method not implemented.");
    }
    findByIdOrThrow(id: CustomerId): Promise<Customer> {
        throw new Error("Method not implemented.");
    }
    countActiveCustomersByWeek(week: Week): Promise<number> {
        throw new Error("Method not implemented.");
    }
    countNewCustomersByWeek(week: Week): Promise<number> {
        throw new Error("Method not implemented.");
    }
    countCustomersWithFriendCode(): Promise<number> {
        throw new Error("Method not implemented.");
    }
    countNewLeadsByWeek(week: Week): Promise<number> {
        throw new Error("Method not implemented.");
    }
    delete(customerId: CustomerId): void {
        throw new Error("Method not implemented.");
    }
    private customers: any[] = [];

    public async save(customer: any): Promise<void> {
        this.customers.push(customer);
    }

    public async findByEmail(email: string): Promise<any | undefined> {
        return this.customers.find((customer) => customer.email === email);
    }

    public async isEmailVerified(email: string): Promise<boolean> {
        return this.customers.some((customer) => customer.email === email);
    }

    public async findById(id: any): Promise<any | undefined> {
        return this.customers.find((customer) => customer.id === id);
    }

    public async findByIdList(ids: any[]): Promise<any[]> {
        return this.customers.filter((customer) => ids.includes(customer.id));
    }

    public async findAll(): Promise<any[]> {
        return this.customers;
    }

    public async findByName(name: string): Promise<any[]> {
        return this.customers.filter((customer) => customer.name === name);
    }
}
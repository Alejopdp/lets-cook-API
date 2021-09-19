import { Customer } from "../../domain/customer/Customer";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { ShippingZone } from "../../domain/shipping/ShippingZone";

export class UpdatePaymentOrdersShippingCost {
    private _customerRepository: ICustomerRepository;
    private _paymentOrderRepository: IPaymentOrderRepository;

    constructor(customerRepository: ICustomerRepository, paymentOrderRepository: IPaymentOrderRepository) {
        this._customerRepository = customerRepository;
        this._paymentOrderRepository = paymentOrderRepository;
    }

    public async execute(shippingZone: ShippingZone, newShippingCost: number): Promise<void> {
        const customers: Customer[] = await this.customerRepository.findAll();
        const customersInsideTheShippingZone = customers.filter(
            (customer) =>
                customer.shippingAddress?.latitude &&
                customer.shippingAddress?.longitude &&
                shippingZone.hasAddressInside(customer.shippingAddress?.latitude, customer.shippingAddress?.longitude)
        );
        const paymentOrdersToUpdate = await this.paymentOrderRepository.findActiveByCustomerIdsList(
            customersInsideTheShippingZone.map((customer) => customer.id)
        );

        for (let paymentOrder of paymentOrdersToUpdate) {
            paymentOrder.shippingCost = newShippingCost;
        }

        await this.paymentOrderRepository.updateShippingCost(paymentOrdersToUpdate, newShippingCost);
    }

    /**
     * Getter paymentOrderRepository
     * @return {IPaymentOrderRepository}
     */
    public get paymentOrderRepository(): IPaymentOrderRepository {
        return this._paymentOrderRepository;
    }

    /**
     * Getter customerRepository
     * @return {ICustomerRepository}
     */
    public get customerRepository(): ICustomerRepository {
        return this._customerRepository;
    }
}

import { IStorageService } from "../../application/storageService/IStorageService";
import { CustomerId } from "../../domain/customer/CustomerId";
import { Customer } from "../../domain/customer/Customer";
import { Address } from "../../domain/address/Address";
import { AddressId } from "../../domain/address/AddressId";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { UpdateCustomerShippingDto } from "./updateCustomerShippingDto";
import { PreferredDeliveryTimeFactory } from "../../domain/customer/preferredDeliveryTime/preferredDeliveryTimeFactory";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { IShippingZoneRepository } from "../../infra/repositories/shipping/IShippingZoneRepository";
import { ShippingZone } from "../../domain/shipping/ShippingZone";

export class UpdateCustomerShipping {
    private _customerRepository: ICustomerRepository;
    private _paymentOrderRepository: IPaymentOrderRepository;
    private _shippingZoneRepository: IShippingZoneRepository;
    private _storageService: IStorageService;

    constructor(
        customerRepository: ICustomerRepository,
        paymentOrderRepository: IPaymentOrderRepository,
        shippingZoneRepository: IShippingZoneRepository,
        storageService: IStorageService
    ) {
        this._customerRepository = customerRepository;
        this._paymentOrderRepository = paymentOrderRepository;
        this._shippingZoneRepository = shippingZoneRepository;
        this._storageService = storageService;
    }

    public async execute(dto: UpdateCustomerShippingDto): Promise<void> {
        const shippingZones: ShippingZone[] = await this.shippingZoneRepository.findAll();
        const customerNewShippingZone: ShippingZone | undefined = shippingZones.find((zone) => zone.hasAddressInside(dto.lat, dto.long));
        if (!!!customerNewShippingZone)
            throw new Error("En este momento no podemos servir en tu zona, pero puedes dejarnos tu email y te avisaremos cuando toque!");

        const customerId: CustomerId = new CustomerId(dto.customerId);
        const customer: Customer | undefined = await this.customerRepository.findByIdOrThrow(customerId);
        const paymentOrders: PaymentOrder[] = await this.paymentOrderRepository.findFutureOrdersByCustomer(customerId);
        const preferredDeliveryTime = PreferredDeliveryTimeFactory.createDeliveryTime(dto.deliveryTime);

        customer.changeShippingAddress(dto.lat, dto.long, dto.name, dto.fullName, dto.details, preferredDeliveryTime);
        paymentOrders.forEach((order) => (order.shippingCost = customerNewShippingZone.cost));

        await this.paymentOrderRepository.updateMany(paymentOrders);
        await this.customerRepository.save(customer);
    }

    /**
     * Getter customerRepository
     * @return {ICustomerRepository}
     */
    public get customerRepository(): ICustomerRepository {
        return this._customerRepository;
    }

    /**
     * Getter storageService
     * @return {IStorageService}
     */
    public get storageService(): IStorageService {
        return this._storageService;
    }

    /**
     * Getter paymentOrderRepository
     * @return {IPaymentOrderRepository}
     */
    public get paymentOrderRepository(): IPaymentOrderRepository {
        return this._paymentOrderRepository;
    }

    /**
     * Getter shippingZoneRepository
     * @return {IShippingZoneRepository}
     */
    public get shippingZoneRepository(): IShippingZoneRepository {
        return this._shippingZoneRepository;
    }
}

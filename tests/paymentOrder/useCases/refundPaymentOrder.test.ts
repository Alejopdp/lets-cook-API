jest.mock("../../../src/bounded_contexts/operations/application/paymentService/mockPaymentService")
import moment from "moment"
import { RefundPaymentOrder } from "../../../src/bounded_contexts/operations/useCases/refundPaymentOrder/refundPaymentOrder"
import { CreateSubscription } from "../../../src/bounded_contexts/operations/useCases/createSubscription/createSubscription"
import { CreateWallet } from "../../../src/bounded_contexts/operations/useCases/createWallet/createWallet"
import { ChargeMoneyToWalletUseCase } from "../../../src/bounded_contexts/operations/useCases/chargeMoneyToWallet/chargeMoneyToWallet"
import { ChargeMoneyToWallet } from "../../../src/bounded_contexts/operations/services/chargeMoneyToWallet/chargeMoneyToWallet"
import { InMemoryCustomerRepository } from "../../../src/bounded_contexts/operations/infra/repositories/customer/inMemoryCustomerRepository"
import { InMemorySusbcriptionRepository } from "../../../src/bounded_contexts/operations/infra/repositories/subscription/inMemorySubscriptionRepository"
import { InMemoryShippingZoneRepository } from "../../../src/bounded_contexts/operations/infra/repositories/shipping/inMemoryShippingZoneRepository"
import { InMemoryPlanRepository } from "../../../src/bounded_contexts/operations/infra/repositories/plan/mockPlanRepository"
import { MockWeekRepository } from "../../../src/bounded_contexts/operations/infra/repositories/week/mockWeekRepository"
import { InMemoryOrderRepository } from "../../../src/bounded_contexts/operations/infra/repositories/order/mockOrderRepository"
import { InMemoryCouponRepository } from "../../../src/bounded_contexts/operations/infra/repositories/coupon/mockCouponRepository"
import { InMemoryPaymentOrderRepository } from "../../../src/bounded_contexts/operations/infra/repositories/paymentOrder/mockPaymentOrderRepository"
import { InMemoryLogRepository } from "../../../src/bounded_contexts/operations/infra/repositories/log/mockLogRepository"
import { MockPaymentService } from "../../../src/bounded_contexts/operations/application/paymentService/mockPaymentService"
import { MockNotificationService } from "../../../src/shared/notificationService/mockNotificationService"
import { AssignOrdersToPaymentOrders } from "../../../src/bounded_contexts/operations/services/assignOrdersToPaymentOrders/assignOrdersToPaymentOrders"
import { CreatePaymentOrders } from "../../../src/bounded_contexts/operations/services/createPaymentOrders/createPaymentOrders"
import { Customer } from "../../../src/bounded_contexts/operations/domain/customer/Customer"
import { UserPassword } from "../../../src/bounded_contexts/IAM/domain/user/UserPassword"
import { Locale } from "../../../src/bounded_contexts/operations/domain/locale/Locale"
import { CustomerId } from "../../../src/bounded_contexts/operations/domain/customer/CustomerId"
import { ShippingZone } from "../../../src/bounded_contexts/operations/domain/shipping/ShippingZone"
import { ShippingZoneRadio } from "../../../src/bounded_contexts/operations/domain/shipping/ShippingZoneRadio/ShippingZoneRadio"
import { Coordinates } from "../../../src/bounded_contexts/operations/domain/shipping/ShippingZoneRadio/Coordinates"
import { CreateFriendCode } from "../../../src/bounded_contexts/operations/services/createFriendCode/createFriendCode"
import { Order } from "../../../src/bounded_contexts/operations/domain/order/Order"
import { PaymentOrder } from "../../../src/bounded_contexts/operations/domain/paymentOrder/PaymentOrder"
import { CreateSubscriptionDto } from "../../../src/bounded_contexts/operations/useCases/createSubscription/createSubscriptionDto"
import { PaymentIntent } from "../../../src/bounded_contexts/operations/application/paymentService"
import { Subscription } from "../../../src/bounded_contexts/operations/domain/subscription/Subscription"
import { gourmetPlan, gourmetPlanSku, planGourmetVariant2Persons2Recipes, planGourmetVariant2Persons3Recipes } from "../../mocks/plan"
import { MONDAY, TUESDAY, WEDNESDAY } from "../../mocks/days"
import { PaymentMethod } from "../../../src/bounded_contexts/operations/domain/customer/paymentMethod/PaymentMethod"
import { WalletMovementLogType } from "../../../src/bounded_contexts/operations/domain/customer/wallet/WalletMovementLog/WalletMovementLogTypeEnum"
import { Coupon } from "../../../src/bounded_contexts/operations/domain/cupons/Cupon"
import { CouponTypeFactory } from "../../../src/bounded_contexts/operations/domain/cupons/CuponType/CouponTypeFactory"
import { CouponState } from "../../../src/bounded_contexts/operations/domain/cupons/CouponState"
import { CUSTOMER_ADDRESS_DETAILS, CUSTOMER_ADDRESS_NAME, CUSTOMER_FIRST_NAME, CUSTOMER_LAST_NAME, CUSTOMER_LATITUDE, CUSTOMER_LONGITUDE, CUSTOMER_PHONE } from "../../mocks/customer"
import { PayAllSubscriptions } from "../../../src/bounded_contexts/operations/services/payAllSubscriptions/payAllSubscriptions"
import { PaymentMethodId } from "../../../src/bounded_contexts/operations/domain/customer/paymentMethod/PaymentMethodId"

const mockCustomerRepository = new InMemoryCustomerRepository([])
const mockSubscriptionRepository = new InMemorySusbcriptionRepository([])
const mockShippingZoneRepository = new InMemoryShippingZoneRepository([])
const mockPlanRepository = new InMemoryPlanRepository([])
const mockWeekRepository = new MockWeekRepository()
const mockOrderRepository = new InMemoryOrderRepository([])
const mockCouponRepository = new InMemoryCouponRepository([])
const mockPaymentService = new MockPaymentService() as jest.Mocked<MockPaymentService>
const mockNotificationService = new MockNotificationService()
const mockPaymentOrderRepository = new InMemoryPaymentOrderRepository([])
const createPaymentOrdersService: CreatePaymentOrders = new CreatePaymentOrders()
const assignOrdersToPaymentOrderService = new AssignOrdersToPaymentOrders(mockPaymentOrderRepository, createPaymentOrdersService)
const mockLogRepository = new InMemoryLogRepository([])
const mockCreateFriendCodeService = new CreateFriendCode(mockCouponRepository, mockCustomerRepository)
const createSubscriptionUseCase = new CreateSubscription(mockCustomerRepository, mockSubscriptionRepository, mockShippingZoneRepository, mockPlanRepository, mockWeekRepository, mockOrderRepository, mockCouponRepository, mockPaymentService, mockNotificationService, assignOrdersToPaymentOrderService, mockPaymentOrderRepository, mockLogRepository, mockCreateFriendCodeService)

mockPaymentService.createPaymentIntentAndSetupForFutureUsage.mockImplementation(async (amount: number, paymentMethod: string, receiptEmail: string, customerId: string): Promise<PaymentIntent> => ({
    client_secret: "client_secret",
    id: "id",
    status: "succeeded",
    amount: 0
}))

//@ts-ignore
mockPaymentService.paymentIntent.mockImplementation(async (amount: number, paymentMethod: string, receiptEmail: string, customerId: string, offSession: boolean): Promise<PaymentIntent> => await ({
    status: "succeeded",
    client_secret: "client_secret",
    id: "id",
    amount: 0
}))


const CUSTOMER_ID = new CustomerId()
const CUSTOMER_PASSWORD = UserPassword.create("Pass1234", false)
const CUSTOMER_EMAIL = "alejoscotti@gmail.com"
const customer = Customer.create(
    CUSTOMER_EMAIL,
    true,
    "",
    [],
    0,
    new Date(),
    undefined,
    undefined,
    CUSTOMER_PASSWORD,
    "active",
    undefined,
    undefined,
    CUSTOMER_ID
)
mockCustomerRepository.save(customer)
mockPlanRepository.save(gourmetPlan)

const valenciaPolygon = [
    [39.75, -0.78],  // Noroeste
    [39.75, -0.22],  // Noreste
    [38.98, -0.22],  // Sureste
    [38.98, -0.78]   // Suroeste
];
const customerShippingZoneRadio = new ShippingZoneRadio(valenciaPolygon.map((coordinates) => new Coordinates(coordinates[0], coordinates[1])))
const MOCK_SHIPPING_COST = 0
const customerShippingZone = ShippingZone.create("Valencia", "valencia", MOCK_SHIPPING_COST, "active", customerShippingZoneRadio, TUESDAY)
mockShippingZoneRepository.save(customerShippingZone)


const createWallet = new CreateWallet(mockCustomerRepository)
const chargeMoneyToWalletService = new ChargeMoneyToWallet(mockPaymentService)
const billingJob = new PayAllSubscriptions(mockCustomerRepository, mockOrderRepository, mockPaymentOrderRepository, mockPaymentService, mockSubscriptionRepository, mockWeekRepository, mockShippingZoneRepository, mockNotificationService)
const refundPaymentOrder = new RefundPaymentOrder(mockPaymentOrderRepository, mockPaymentService, mockLogRepository, mockCustomerRepository)


describe("Refund Payment Order Use Case", () => {
    describe("Given a customer with a subscription and wallet as payment method", () => {
        const PURCHSAE_DATE = new Date(2023, 8, 25)
        let customerPaymentMethod: PaymentMethod;
        let createSubscriptionDto: CreateSubscriptionDto
        let firstSubscriptionResult: any

        beforeAll(async () => {

            customerPaymentMethod = new PaymentMethod("visa", "4242", 8, 2030, "420", false, "stripe_id")
            customer.addPaymentMethod(customerPaymentMethod)

            createSubscriptionDto = {
                customerId: CUSTOMER_ID.toString(),
                planId: gourmetPlan.id.toString(),
                planVariantId: planGourmetVariant2Persons2Recipes.id.toString(),
                planFrequency: "weekly",
                restrictionComment: "string",
                stripePaymentMethodId: "",
                couponId: undefined,
                paymentMethodId: "wallet",
                addressName: CUSTOMER_ADDRESS_NAME,
                addressDetails: CUSTOMER_ADDRESS_DETAILS,
                latitude: CUSTOMER_LATITUDE,
                longitude: CUSTOMER_LONGITUDE,
                customerFirstName: CUSTOMER_FIRST_NAME,
                customerLastName: CUSTOMER_LAST_NAME,
                phone1: CUSTOMER_PHONE,
                locale: Locale.es,
                shippingCity: "Alboraya",
                shippingProvince: "Valencia",
                shippingPostalCode: "46120",
                shippingCountry: "España",
                purchaseDate: PURCHSAE_DATE
            }

            await createWallet.execute({ amountToCharge: 10, customerId: CUSTOMER_ID.toString(), datesOfCharge: [{ dayNumber: 1, hour: "13", minute: "45" }], paymentMethodForCharging: customerPaymentMethod.id.toString(), locale: Locale.es })
            await chargeMoneyToWalletService.execute({ customer, amountToCharge: 210 })


            firstSubscriptionResult = await createSubscriptionUseCase.execute(createSubscriptionDto)
        })

        describe("When the admin tries to do a complete refund", () => {
            beforeAll(async () => {
                const paymentOrders = await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)

                await refundPaymentOrder.execute({ amount: planGourmetVariant2Persons2Recipes.getPaymentPrice(), paymentOrderId: paymentOrders[0].id.toString() })
            })

            it("Should not call the payment service, as there is no payment intent in stripe", () => {
                expect(mockPaymentService.refund).not.toHaveBeenCalled()
            })

            it("Should increase the wallet balance correctly", async () => {
                const customer = await mockCustomerRepository.findByIdOrThrow(CUSTOMER_ID)

                expect(customer.wallet!.balance).toBe(210)
            })

            it("Should leave the payment order in REFUNDED state", async () => {
                const paymentOrders: PaymentOrder[] = await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)

                expect(paymentOrders[0].state.title).toBe("PAYMENT_ORDER_REFUNDED")
            })

            it("Should create a refund wallet log with the amount refunded", async () => {
                const customer = await mockCustomerRepository.findByIdOrThrow(CUSTOMER_ID)
                const qtyOfLogs = customer.wallet!.walletMovements.length ?? 0

                expect(customer.wallet!.walletMovements[qtyOfLogs - 1].type).toBe(WalletMovementLogType.REFUND_WALLET)
                expect(customer.wallet!.walletMovements[qtyOfLogs - 1].amount).toBe(planGourmetVariant2Persons2Recipes.getPaymentPrice())
            })
        })

        describe("When the admin tries to do a partial refund", () => {
            beforeAll(async () => {
                customer.setDefaultPaymentMethod(new PaymentMethodId("wallet"))
                await billingJob.execute({ executionDate: new Date(2023, 9, 7, 6) })

                const paymentOrders = await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)

                await refundPaymentOrder.execute({ amount: 10, paymentOrderId: paymentOrders[1].id.toString() })
            })

            it("Should not call the payment service", () => {
                expect(mockPaymentService.refund).not.toHaveBeenCalled()
            })

            it("Should increase the wallet balance correctly", async () => {
                const customer = await mockCustomerRepository.findByIdOrThrow(CUSTOMER_ID)

                expect(customer.wallet!.balance).toBe(192.01)
            })

            it("Should leave the payment order in PARTIALLY_REFUNDED state", async () => {
                const paymentOrders: PaymentOrder[] = await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)

                expect(paymentOrders[1].isPartiallyRefunded()).toBeTruthy()
            })

            it("Should create a refund wallet log with the amount refunded", async () => {
                const customer = await mockCustomerRepository.findByIdOrThrow(CUSTOMER_ID)
                const qtyOfLogs = customer.wallet!.walletMovements.length ?? 0

                expect(customer.wallet!.walletMovements[qtyOfLogs - 1].type).toBe(WalletMovementLogType.REFUND_WALLET)
                expect(customer.wallet!.walletMovements[qtyOfLogs - 1].amount).toBe(10)
            })

            describe("When the admin refunds the remaining amount", () => {
                beforeAll(async () => {
                    const paymentOrders = await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)

                    await refundPaymentOrder.execute({ amount: 17.99, paymentOrderId: paymentOrders[1].id.toString() })
                })

                it("Should not call the payment service", () => {
                    expect(mockPaymentService.refund).not.toHaveBeenCalled()
                })

                it("Should increase the wallet balance correctly", async () => {
                    const customer = await mockCustomerRepository.findByIdOrThrow(CUSTOMER_ID)

                    expect(customer.wallet!.balance).toBe(210)
                })

                it("Should leave the payment order in REFUNDED state", async () => {
                    const paymentOrders: PaymentOrder[] = await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)

                    expect(paymentOrders[1].state.title).toBe("PAYMENT_ORDER_REFUNDED")
                })

                it("Should create a refund wallet log with the amount refunded", async () => {
                    const customer = await mockCustomerRepository.findByIdOrThrow(CUSTOMER_ID)
                    const qtyOfLogs = customer.wallet!.walletMovements.length ?? 0

                    expect(customer.wallet!.walletMovements[qtyOfLogs - 1].type).toBe(WalletMovementLogType.REFUND_WALLET)
                    expect(customer.wallet!.walletMovements[qtyOfLogs - 1].amount).toBe(17.99)
                })
            })
        })
    })
})
jest.mock("../../../src/bounded_contexts/operations/application/paymentService/mockPaymentService")
import moment from "moment"
import { RetryPaymentOfRejectedPaymentOrder } from "../../../src/bounded_contexts/operations/useCases/retryPaymentOfRejectedPaymentOrder/retryPaymentOfRejectedPaymentOrder"
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
const retryPaymentOfPaymentOrderUseCase = new RetryPaymentOfRejectedPaymentOrder(mockPaymentOrderRepository, mockCustomerRepository, mockPaymentService, mockOrderRepository)

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

describe("Retry payment of rejected payment order", () => {
    describe('Given a rejected payment order with a wallet from a subscription', () => {
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

        describe("When retrying the payment using the wallet payment method", () => {

            beforeAll(async () => {
                const billingJob = new PayAllSubscriptions(mockCustomerRepository, mockOrderRepository, mockPaymentOrderRepository, mockPaymentService, mockSubscriptionRepository, mockWeekRepository, mockShippingZoneRepository, mockNotificationService)

                customer.setDefaultPaymentMethod(new PaymentMethodId("wallet"))
                customer.wallet!.balance = 10
                await billingJob.execute({ executionDate: new Date(2023, 9, 7, 6) })
                customer.wallet!.balance = 182.01
                //@ts-ignore
                mockPaymentService.paymentIntent.mockImplementationOnce(async (amount: number, paymentMethod: string, receiptEmail: string, customerId: string, offSession: boolean): Promise<PaymentIntent> => await ({
                    status: "cancelled",
                    client_secret: "client_secret",
                    id: "id",
                    amount: 0
                }))

                const paymentOrders: PaymentOrder[] = await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)
                await retryPaymentOfPaymentOrderUseCase.execute({ paymentOrderId: paymentOrders[1].id.toString() })
            })

            it("Should decrease the wallet balance", async () => {
                expect(customer.wallet?.balance).toBe(154.02)
            })
            it("Should change the state to the payment order to billed", async () => {
                const paymentOrders: PaymentOrder[] = await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)

                expect(paymentOrders[1].isBilled()).toBeTruthy()
            })

            it("Should add a human id to the payment order", async () => {
                const paymentOrders: PaymentOrder[] = await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)

                expect(paymentOrders[1].humanId).toBeDefined()
            })

            it("Should add a human id to the payment order", async () => {
                const paymentOrders: PaymentOrder[] = await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)

                expect(paymentOrders[1].paymentIntentId).toBe("Monedero")
            })


        })
    })
})
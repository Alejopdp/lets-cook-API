import { CreateSubscription } from "../../../src/bounded_contexts/operations/useCases/createSubscription/createSubscription"
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
import { Plan } from "../../../src/bounded_contexts/operations/domain/plan/Plan"
import { PlanSku } from "../../../src/bounded_contexts/operations/domain/plan/PlanSku"
import { PlanType } from "../../../src/bounded_contexts/operations/domain/plan/PlanType/PlanType"
import { PlanVariant } from "../../../src/bounded_contexts/operations/domain/plan/PlanVariant/PlanVariant"
import { PlanFrequencyFactory } from "../../../src/bounded_contexts/operations/domain/plan/PlanFrequency/PlanFrequencyFactory"
import { Locale } from "../../../src/bounded_contexts/operations/domain/locale/Locale"
import { PlanSlug } from "../../../src/bounded_contexts/operations/domain/plan/PlanSlug"
import { PlanId } from "../../../src/bounded_contexts/operations/domain/plan/PlanId"
import { CustomerId } from "../../../src/bounded_contexts/operations/domain/customer/CustomerId"
import { ShippingZone } from "../../../src/bounded_contexts/operations/domain/shipping/ShippingZone"
import { ShippingZoneRadio } from "../../../src/bounded_contexts/operations/domain/shipping/ShippingZoneRadio/ShippingZoneRadio"
import { Coordinates } from "../../../src/bounded_contexts/operations/domain/shipping/ShippingZoneRadio/Coordinates"
import { Day } from "../../../src/bounded_contexts/operations/domain/day/Day"

const mockCustomerRepository = new InMemoryCustomerRepository([])
const mockSubscriptionRepository = new InMemorySusbcriptionRepository([])
const mockShippingZoneRepository = new InMemoryShippingZoneRepository([])
const mockPlanRepository = new InMemoryPlanRepository([])
const mockWeekRepository = new MockWeekRepository([])
const mockOrderRepository = new InMemoryOrderRepository([])
const mockCouponRepository = new InMemoryCouponRepository([])
const mockPaymentService = new MockPaymentService()
const mockNotificationService = new MockNotificationService()
const mockPaymentOrderRepository = new InMemoryPaymentOrderRepository([])
const createPaymentOrdersService: CreatePaymentOrders = new CreatePaymentOrders()
const assignOrdersToPaymentOrderService = new AssignOrdersToPaymentOrders(mockPaymentOrderRepository, createPaymentOrdersService)
const mockLogRepository = new InMemoryLogRepository([])

const createSubscriptionUseCase = new CreateSubscription(mockCustomerRepository, mockSubscriptionRepository, mockShippingZoneRepository, mockPlanRepository, mockWeekRepository, mockOrderRepository, mockCouponRepository, mockPaymentService, mockNotificationService, assignOrdersToPaymentOrderService, mockPaymentOrderRepository, mockLogRepository)

const customerId = new CustomerId()
const customerPassword = UserPassword.create("Pass1234", false)
const customerEmail = "alejoscotti@gmail.com"
const customer = Customer.create(
    customerEmail,
    true,
    "",
    [],
    0,
    new Date(),
    undefined,
    undefined,
    customerPassword,
    "active",
    undefined,
    undefined,
    customerId
)
mockCustomerRepository.save(customer)
const gourmetPlanSku = new PlanSku("PlanGourmet")
const gourmetPlanSlug = new PlanSlug("plan-gourmet")
const planGourmetVariant2Persons2Recipes: PlanVariant = new PlanVariant(
    new PlanSku("GOUR1"),
    "",
    35.96,
    [],
    "",
    true,
    false,
    27.99,
    undefined,
    2,
    2
);
const planGourmetVariant2Persons3Recipes: PlanVariant = new PlanVariant(
    new PlanSku("GOUR2"),
    "",
    53.94,
    [],
    "",
    false,
    false,
    37.99,
    undefined,
    2,
    3
);
const gourmetPlanId = new PlanId()
const gourmetPlan = Plan.create("Plan Gourmet", "Plan Gourmet Description", gourmetPlanSku, "", true, PlanType.Principal, [planGourmetVariant2Persons2Recipes, planGourmetVariant2Persons3Recipes], [PlanFrequencyFactory.createPlanFrequency("weekly"), PlanFrequencyFactory.createPlanFrequency("biweekly")], true, [], Locale.es, gourmetPlanSlug, true, "", "", gourmetPlanId, true)
mockPlanRepository.save(gourmetPlan)

const valenciaPolygon = [
    [39.75, -0.78],  // Noroeste
    [39.75, -0.22],  // Noreste
    [38.98, -0.22],  // Sureste
    [38.98, -0.78]   // Suroeste
];
const customerShippingZoneRadio = new ShippingZoneRadio(valenciaPolygon.map((coordinates) => new Coordinates(coordinates[0], coordinates[1])))
const customerShippingZone = ShippingZone.create("Valencia", "valencia", 10, "active", customerShippingZoneRadio, new Day(2))
mockShippingZoneRepository.save(customerShippingZone)

// TENGO QUE CREAR UN MOCK DE CREATE FRIEND ZONE, INYECTARLO COMO DEPENDENCIA Y MOCKEARLO PORQUE ESTA HARDCODEADO EN EL USE CASE.

describe("Create Subscription", () => {

    describe("Creating a first weekly subscription for a fresh new customer", () => {

        it("Should create a subscription successfully", () => {
            const createSubscriptionDto = {
                customerId: customerId.toString(),
                planId: gourmetPlan.id.toString(),
                planVariantId: planGourmetVariant2Persons2Recipes.id.toString(),
                planFrequency: "weekly",
                restrictionComment: "string",
                stripePaymentMethodId: "",
                couponId: undefined,
                paymentMethodId: "string",
                addressName: "Vicent Blasco Ibañez 5",
                addressDetails: "Bloque 7, Escalera 2, Puerta 9",
                latitude: 39.4869251,
                longitude: -0.3298131,
                customerFirstName: "Alejo",
                customerLastName: "Scotti",
                phone1: "634135817",
                locale: Locale.es,
                shippingCity: "Alboraya",
                shippingProvince: "Valencia",
                shippingPostalCode: "46120",
                shippingCountry: "España"
            }

            const result = createSubscriptionUseCase.execute(createSubscriptionDto)

            expect(result).toBeDefined()
            expect(result).toHaveProperty("subscription")
            expect(result).toHaveProperty("firstOrder")
            expect(result).toHaveProperty("customerPaymentMethods")
            expect(result).toHaveProperty("amountBilled")
            expect(result).toHaveProperty("tax")
            expect(result).toHaveProperty("shippingCost")
            expect(result).toHaveProperty("billedPaymentOrderHumanId")

        })
    })

})

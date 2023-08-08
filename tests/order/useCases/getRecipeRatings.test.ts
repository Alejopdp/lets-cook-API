import { MockRecipeRepository } from "../../../src/bounded_contexts/operations/infra/repositories/recipe/mockRecipeRepository";
import { InMemoryRateRepository } from "../../../src/bounded_contexts/operations/infra/repositories/rate/inMemoryRateRepository";
import { GetRateList } from "../../../src/bounded_contexts/operations/useCases/getRateList/getRateList";
import { IStorageService } from "../../../src/bounded_contexts/operations/application/storageService/IStorageService";
import { MockStorageService } from "../../../src/bounded_contexts/operations/application/storageService/mockStorageService";
import { GetRateListPresenter, HttpGetRateListResponse } from "../../../src/bounded_contexts/operations/useCases/getRateList/getRateListPresenter";
import { CustomerId } from "../../../src/bounded_contexts/operations/domain/customer/CustomerId";
import { gourmetPlan, planVegetariano, planVegetarianoVariant2Persons2Recipes } from "../../mocks/plan";
import { CUSTOMER_ADDRESS_DETAILS, CUSTOMER_ADDRESS_NAME, CUSTOMER_EMAIL, CUSTOMER_FIRST_NAME, CUSTOMER_LAST_NAME, CUSTOMER_LATITUDE, CUSTOMER_LONGITUDE, CUSTOMER_PASSWORD, CUSTOMER_PHONE } from "../../mocks/customer";
import { Locale } from "../../../src/bounded_contexts/operations/domain/locale/Locale";
import { CreateSubscription } from "../../../src/bounded_contexts/operations/useCases/createSubscription/createSubscription";
import { InMemoryLogRepository } from "../../../src/bounded_contexts/operations/infra/repositories/log/mockLogRepository";
import { AssignOrdersToPaymentOrders } from "../../../src/bounded_contexts/operations/services/assignOrdersToPaymentOrders/assignOrdersToPaymentOrders";
import { CreatePaymentOrders } from "../../../src/bounded_contexts/operations/services/createPaymentOrders/createPaymentOrders";
import { InMemoryPaymentOrderRepository } from "../../../src/bounded_contexts/operations/infra/repositories/paymentOrder/mockPaymentOrderRepository";
import { MockNotificationService } from "../../../src/shared/notificationService/mockNotificationService";
import { MockPaymentService } from "../../../src/bounded_contexts/operations/application/paymentService/mockPaymentService";
import { InMemoryCouponRepository } from "../../../src/bounded_contexts/operations/infra/repositories/coupon/mockCouponRepository";
import { InMemoryOrderRepository } from "../../../src/bounded_contexts/operations/infra/repositories/order/mockOrderRepository";
import { MockWeekRepository } from "../../../src/bounded_contexts/operations/infra/repositories/week/mockWeekRepository";
import { InMemoryPlanRepository } from "../../../src/bounded_contexts/operations/infra/repositories/plan/mockPlanRepository";
import { InMemoryShippingZoneRepository } from "../../../src/bounded_contexts/operations/infra/repositories/shipping/inMemoryShippingZoneRepository";
import { InMemorySusbcriptionRepository } from "../../../src/bounded_contexts/operations/infra/repositories/subscription/inMemorySubscriptionRepository";
import { InMemoryCustomerRepository } from "../../../src/bounded_contexts/operations/infra/repositories/customer/inMemoryCustomerRepository";
import { CreateFriendCode } from "../../../src/bounded_contexts/operations/services/createFriendCode/createFriendCode";
import { Customer } from "../../../src/bounded_contexts/operations/domain/customer/Customer";
import { ChooseRecipesForOrder } from "../../../src/bounded_contexts/operations/useCases/chooseRecipesForOrder/chooseRecipesForOrder";
import { arepasDeCrhistian, burgerHallouli, rissotoDeBoniato } from "../../mocks/recipe";
import { ShippingZoneRadio } from "../../../src/bounded_contexts/operations/domain/shipping/ShippingZoneRadio/ShippingZoneRadio";
import { Coordinates } from "../../../src/bounded_contexts/operations/domain/shipping/ShippingZoneRadio/Coordinates";
import { TUESDAY } from "../../mocks/days";
import { ShippingZone } from "../../../src/bounded_contexts/operations/domain/shipping/ShippingZone";
import { UpdateRate } from "../../../src/bounded_contexts/operations/useCases/updateRate/updateRate";

const mockRecipeRepository = new MockRecipeRepository([])
mockRecipeRepository.save(burgerHallouli)
mockRecipeRepository.save(arepasDeCrhistian)
mockRecipeRepository.save(rissotoDeBoniato)
const mockStorageService: IStorageService = new MockStorageService()
const mockGetRateListPresenter = new GetRateListPresenter(mockStorageService)
const mockRecipeRatingRepository = new InMemoryRateRepository([])
const getRateList = new GetRateList(mockRecipeRatingRepository, mockGetRateListPresenter)
const mockCustomerRepository = new InMemoryCustomerRepository([])
const mockSubscriptionRepository = new InMemorySusbcriptionRepository([])
const mockShippingZoneRepository = new InMemoryShippingZoneRepository([])
const mockPlanRepository = new InMemoryPlanRepository([])
const mockWeekRepository = new MockWeekRepository()
const mockOrderRepository = new InMemoryOrderRepository([])
const mockCouponRepository = new InMemoryCouponRepository([])
const mockPaymentService = new MockPaymentService()
const mockNotificationService = new MockNotificationService()
const mockPaymentOrderRepository = new InMemoryPaymentOrderRepository([])
const createPaymentOrdersService: CreatePaymentOrders = new CreatePaymentOrders()
const assignOrdersToPaymentOrderService = new AssignOrdersToPaymentOrders(mockPaymentOrderRepository, createPaymentOrdersService)
const mockLogRepository = new InMemoryLogRepository([])
const mockCreateFriendCodeService = new CreateFriendCode(mockCouponRepository, mockCustomerRepository)
const CUSTOMER_ID = new CustomerId()
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
const valenciaPolygon = [
    [39.75, -0.78],  // Noroeste
    [39.75, -0.22],  // Noreste
    [38.98, -0.22],  // Sureste
    [38.98, -0.78]   // Suroeste
];
const customerShippingZoneRadio = new ShippingZoneRadio(valenciaPolygon.map((coordinates) => new Coordinates(coordinates[0], coordinates[1])))
const MOCK_SHIPPING_COST = 10
const customerShippingZone = ShippingZone.create("Valencia", "valencia", MOCK_SHIPPING_COST, "active", customerShippingZoneRadio, TUESDAY)
mockShippingZoneRepository.save(customerShippingZone)
mockCustomerRepository.save(customer)
mockPlanRepository.bulkSave([gourmetPlan, planVegetariano])

const createSubscriptionUseCase = new CreateSubscription(mockCustomerRepository, mockSubscriptionRepository, mockShippingZoneRepository, mockPlanRepository, mockWeekRepository, mockOrderRepository, mockCouponRepository, mockPaymentService, mockNotificationService, assignOrdersToPaymentOrderService, mockPaymentOrderRepository, mockLogRepository, mockCreateFriendCodeService)
const chooseRecipesForOrder = new ChooseRecipesForOrder(mockOrderRepository, mockRecipeRepository, mockPaymentOrderRepository, mockLogRepository, mockRecipeRatingRepository)

describe("Given a first subscription of a new customer", () => {
    const PURCHASE_DATE = new Date("2023-08-04")

    beforeAll(async () => {
        let createSubscriptionDto: any
        let firstSubscriptionResult: any

        createSubscriptionDto = {
            customerId: CUSTOMER_ID.toString(),
            planId: planVegetariano.id.toString(),
            planVariantId: planVegetarianoVariant2Persons2Recipes.id.toString(),
            planFrequency: "weekly",
            restrictionComment: "string",
            stripePaymentMethodId: "",
            couponId: undefined,
            paymentMethodId: "string",
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
            purchaseDate: PURCHASE_DATE
        }

        firstSubscriptionResult = await createSubscriptionUseCase.execute(createSubscriptionDto)
        const originalWeeksRissoto = [...rissotoDeBoniato.availableWeeks]
        rissotoDeBoniato.availableWeeks = [...rissotoDeBoniato.availableWeeks, firstSubscriptionResult.firstOrder.week]

        await chooseRecipesForOrder.execute({
            choosingDate: new Date("2023-08-04"),
            orderId: firstSubscriptionResult.firstOrder.id.toString(),
            isAdminChoosing: false,
            recipeSelection: [{ quantity: 2, recipeId: rissotoDeBoniato.id.toString(), recipeVariantId: rissotoDeBoniato.recipeVariants[0].id.toString() }]
        })

        rissotoDeBoniato.availableWeeks = [...originalWeeksRissoto]

    })

    describe("When the customer selects its first recipes before the shipping date", () => {
        it("Should not be able to see the recipe to rate", async () => {
            const dto = {
                customerId: CUSTOMER_ID.toString(),
                locale: Locale.es,
                queryDate: new Date("2023-08-06")
            }
            const result: HttpGetRateListResponse = await getRateList.execute(dto)

            expect(result.length).toBe(1)
            expect(result.every((rate) => rate.isRateable === false)).toBe(true)
        })
    })

    describe("When the customer requests for its rates the same day of the shipping date before 13:00 without any rate", () => {
        it("Should not see any rate of the recipe", async () => {
            const dto = {
                customerId: CUSTOMER_ID.toString(),
                locale: Locale.es,
                queryDate: new Date(2023, 7, 8, 12, 59, 0)
            }
            const result: HttpGetRateListResponse = await getRateList.execute(dto)

            expect(result[0].rating).toBe(undefined)
            expect(result.every((rate) => !rate.isRateable)).toBe(true)
        })
    })

    describe("When the customer requests for its rates the same day of the shipping date after 13:00 without any rate", () => {
        it("Should not see any rate of the recipe", async () => {
            const dto = {
                customerId: CUSTOMER_ID.toString(),
                locale: Locale.es,
                queryDate: new Date(2023, 7, 8, 13, 0, 0)
            }
            const result: HttpGetRateListResponse = await getRateList.execute(dto)

            expect(result[0].rating).toBe(undefined)
            expect(result.every((rate) => rate.isRateable)).toBe(true)
        })
    })

    describe("When the customer requests for its rates the day after the shipping date with rate", () => {
        beforeAll(async () => {
            const rateRecipeUseCase = new UpdateRate(mockRecipeRatingRepository, mockStorageService)
            const rates = await getRateList.execute({
                customerId: CUSTOMER_ID.toString(),
                locale: Locale.es,
                queryDate: new Date(2023, 7, 9, 13, 0, 0)
            })

            rateRecipeUseCase.execute({
                commentRate: "Muy rico",
                rateId: rates[0].id.toString(),
                rateValue: 5
            })
        })

        it("Should see the rate of the recipe", async () => {
            const dto = {
                customerId: CUSTOMER_ID.toString(),
                locale: Locale.es,
                queryDate: new Date(2023, 7, 9, 13, 0, 0)
            }
            const result: HttpGetRateListResponse = await getRateList.execute(dto)

            expect(result[0].rating).toBe(5)
            expect(result.every((rate) => rate.isRateable)).toBe(true)
            expect(result.every((rate) => rate.isRated)).toBe(true)
            expect(result[0].comment).toBeDefined()
        })
    })


})
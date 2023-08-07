import { ChooseRecipesForOrder } from "../../../src/bounded_contexts/operations/useCases/chooseRecipesForOrder/chooseRecipesForOrder"
import { CreateSubscription } from "../../../src/bounded_contexts/operations/useCases/createSubscription/createSubscription"
import { Subscription } from "../../../src/bounded_contexts/operations/domain/subscription/Subscription"
import { Customer } from "../../../src/bounded_contexts/operations/domain/customer/Customer";
import { InMemoryCustomerRepository } from "../../../src/bounded_contexts/operations/infra/repositories/customer/inMemoryCustomerRepository";
import { CustomerId } from "../../../src/bounded_contexts/operations/domain/customer/CustomerId";
import { InMemorySusbcriptionRepository } from "../../../src/bounded_contexts/operations/infra/repositories/subscription/inMemorySubscriptionRepository";
import { InMemoryShippingZoneRepository } from "../../../src/bounded_contexts/operations/infra/repositories/shipping/inMemoryShippingZoneRepository";
import { InMemoryPlanRepository } from "../../../src/bounded_contexts/operations/infra/repositories/plan/mockPlanRepository";
import { MockWeekRepository } from "../../../src/bounded_contexts/operations/infra/repositories/week/mockWeekRepository";
import { InMemoryOrderRepository } from "../../../src/bounded_contexts/operations/infra/repositories/order/mockOrderRepository";
import { InMemoryCouponRepository } from "../../../src/bounded_contexts/operations/infra/repositories/coupon/mockCouponRepository";
import { MockPaymentService } from "../../../src/bounded_contexts/operations/application/paymentService/mockPaymentService";
import { MockNotificationService } from "../../../src/shared/notificationService/mockNotificationService";
import { InMemoryPaymentOrderRepository } from "../../../src/bounded_contexts/operations/infra/repositories/paymentOrder/mockPaymentOrderRepository";
import { InMemoryRateRepository } from "../../../src/bounded_contexts/operations/infra/repositories/rate/inMemoryRateRepository";
import { InMemoryLogRepository } from "../../../src/bounded_contexts/operations/infra/repositories/log/mockLogRepository";
import { MockRecipeRepository } from "../../../src/bounded_contexts/operations/infra/repositories/recipe/mockRecipeRepository";
import { CreateFriendCode } from "../../../src/bounded_contexts/operations/services/createFriendCode/createFriendCode";
import { UpdateDiscountAfterSkippingOrders } from "../../../src/bounded_contexts/operations/services/updateDiscountsAfterSkippingOrders/updateDiscountsAfterSkippingOrders";
import { CreatePaymentOrders } from "../../../src/bounded_contexts/operations/services/createPaymentOrders/createPaymentOrders";
import { AssignOrdersToPaymentOrders } from "../../../src/bounded_contexts/operations/services/assignOrdersToPaymentOrders/assignOrdersToPaymentOrders";
import { Locale } from "../../../src/bounded_contexts/operations/domain/locale/Locale";
import { ChooseRecipesForOrderDto } from "../../../src/bounded_contexts/operations/useCases/chooseRecipesForOrder/chooseRecipesForOrderDto";
import { Recipe } from "../../../src/bounded_contexts/operations/domain/recipe/Recipe";
import { gourmetPlan, planGourmetVariant2Persons2Recipes, planVegetariano, planVegetarianoVariant2Persons2Recipes } from "../../mocks/plan";
import { arepasDeCrhistian, burgerHallouli, rissotoDeBoniato } from "../../mocks/recipe";
import { CUSTOMER_ADDRESS_DETAILS, CUSTOMER_ADDRESS_NAME, CUSTOMER_EMAIL, CUSTOMER_FIRST_NAME, CUSTOMER_LAST_NAME, CUSTOMER_LATITUDE, CUSTOMER_LONGITUDE, CUSTOMER_PASSWORD, CUSTOMER_PHONE } from "../../mocks/customer"
import { ShippingZoneRadio } from "../../../src/bounded_contexts/operations/domain/shipping/ShippingZoneRadio/ShippingZoneRadio";
import { Coordinates } from "../../../src/bounded_contexts/operations/domain/shipping/ShippingZoneRadio/Coordinates";
import { TUESDAY } from "../../mocks/days";
import { ShippingZone } from "../../../src/bounded_contexts/operations/domain/shipping/ShippingZone";
import { RecipeId } from "../../../src/bounded_contexts/operations/domain/recipe/RecipeId";
import { UniqueEntityID } from "../../../src/core/domain/UniqueEntityID";
import { Order } from "../../../src/bounded_contexts/operations/domain/order/Order";
import { RecipeRating } from "../../../src/bounded_contexts/operations/domain/recipeRating/RecipeRating";

const mockSubscriptionRepository = new InMemorySusbcriptionRepository([])
const mockShippingZoneRepository = new InMemoryShippingZoneRepository([])
const mockPlanRepository = new InMemoryPlanRepository([])
const mockWeekRepository = new MockWeekRepository()
const mockOrderRepository = new InMemoryOrderRepository([])
const mockCustomerRepository = new InMemoryCustomerRepository([])
const mockCouponRepository = new InMemoryCouponRepository([])
const mockPaymentService = new MockPaymentService()
const mockNotificationService = new MockNotificationService()
const mockPaymentOrderRepository = new InMemoryPaymentOrderRepository([])
const mockRecipeRatingRepository = new InMemoryRateRepository([])
const mockLogRepository = new InMemoryLogRepository([])
const mockRecipeRepository = new MockRecipeRepository([])
mockPlanRepository.bulkSave([gourmetPlan, planVegetariano])
mockRecipeRepository.save(burgerHallouli)
mockRecipeRepository.save(arepasDeCrhistian)
mockRecipeRepository.save(rissotoDeBoniato)
const mockCreateFriendCodeService = new CreateFriendCode(mockCouponRepository, mockCustomerRepository)
const createPaymentOrdersService: CreatePaymentOrders = new CreatePaymentOrders()
const assignOrdersToPaymentOrderService = new AssignOrdersToPaymentOrders(mockPaymentOrderRepository, createPaymentOrdersService)
const updateDiscountsAfterSKippingOrdersService = new UpdateDiscountAfterSkippingOrders(mockSubscriptionRepository, mockOrderRepository, mockPaymentOrderRepository, mockShippingZoneRepository)
const createSubscriptionUseCase = new CreateSubscription(mockCustomerRepository, mockSubscriptionRepository, mockShippingZoneRepository, mockPlanRepository, mockWeekRepository, mockOrderRepository, mockCouponRepository, mockPaymentService, mockNotificationService, assignOrdersToPaymentOrderService, mockPaymentOrderRepository, mockLogRepository, mockCreateFriendCodeService)
const chooseRecipesForOrderUseCase = new ChooseRecipesForOrder(mockOrderRepository, mockRecipeRepository, mockPaymentOrderRepository, mockLogRepository, mockRecipeRatingRepository)

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

const CUSTOMER_ID = new CustomerId()

describe("Given a user with a brand new subscription purchased on Friday", () => {
    const FRIDAY_PURCHASE_DATE: Date = new Date(2023, 7, 4, 17)
    let customer: Customer;
    let subscriptionResult: any
    let subscription: Subscription;

    beforeAll(async () => {
        customer = Customer.create(
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
        await mockCustomerRepository.save(customer)

        const createSubscriptionDto = {
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
            purchaseDate: FRIDAY_PURCHASE_DATE
        }
        subscriptionResult = await createSubscriptionUseCase.execute(createSubscriptionDto)

    })

    describe("When he chooses recipes for the first time after buying", () => {
        it("Should choose the amount of recipes that the plan variant has", async () => {
            const chooseRecipesForOrderDto: ChooseRecipesForOrderDto = {
                isAdminChoosing: false,
                orderId: subscriptionResult.firstOrder.id.toString(),
                recipeSelection: [{ quantity: 1, recipeId: arepasDeCrhistian.id.toString(), recipeVariantId: arepasDeCrhistian.recipeVariants[0].id.toString() }, { quantity: 1, recipeId: rissotoDeBoniato.id.toString(), recipeVariantId: rissotoDeBoniato.recipeVariants[0].id.toString() }],
                choosingDate: FRIDAY_PURCHASE_DATE
            }
            const originalWeeksArepas = [...arepasDeCrhistian.availableWeeks]
            const originalWeeksRissoto = [...rissotoDeBoniato.availableWeeks]

            arepasDeCrhistian.availableWeeks = [...arepasDeCrhistian.availableWeeks, subscriptionResult.firstOrder.week]
            rissotoDeBoniato.availableWeeks = [...rissotoDeBoniato.availableWeeks, subscriptionResult.firstOrder.week]

            await chooseRecipesForOrderUseCase.execute(chooseRecipesForOrderDto)

            arepasDeCrhistian.availableWeeks = [...originalWeeksArepas]
            rissotoDeBoniato.availableWeeks = [...originalWeeksRissoto]

            const order: Order = await mockOrderRepository.findByIdOrThrow(subscriptionResult.firstOrder.id, Locale.es)
            expect(order.recipeSelection.reduce((acc, recipeSelection) => acc + recipeSelection.quantity, 0)).toBe(2)
            mockRecipeRatingRepository.rates = []
        })

        it("Should choose the same recipe more than once if he wants to", async () => {
            const chooseRecipesForOrderDto: ChooseRecipesForOrderDto = {
                isAdminChoosing: false,
                orderId: subscriptionResult.firstOrder.id.toString(),
                recipeSelection: [{ quantity: 2, recipeId: arepasDeCrhistian.id.toString(), recipeVariantId: arepasDeCrhistian.recipeVariants[0].id.toString() }],
                choosingDate: FRIDAY_PURCHASE_DATE
            }
            const originalWeeksArepas = [...arepasDeCrhistian.availableWeeks]
            arepasDeCrhistian.availableWeeks = [...arepasDeCrhistian.availableWeeks, subscriptionResult.firstOrder.week]

            await chooseRecipesForOrderUseCase.execute(chooseRecipesForOrderDto)
            arepasDeCrhistian.availableWeeks = [...originalWeeksArepas]

            const order: Order = await mockOrderRepository.findByIdOrThrow(subscriptionResult.firstOrder.id, Locale.es)
            expect(order.recipeSelection.reduce((acc, recipeSelection) => acc + recipeSelection.quantity, 0)).toBe(2)
            mockRecipeRatingRepository.rates = []

        })

        it("Should create a recipe rating for each recipe chosen", async () => {
            const chooseRecipesForOrderDto: ChooseRecipesForOrderDto = {
                isAdminChoosing: false,
                orderId: subscriptionResult.firstOrder.id.toString(),
                recipeSelection: [{ quantity: 1, recipeId: arepasDeCrhistian.id.toString(), recipeVariantId: arepasDeCrhistian.recipeVariants[0].id.toString() }, { quantity: 1, recipeId: rissotoDeBoniato.id.toString(), recipeVariantId: rissotoDeBoniato.recipeVariants[0].id.toString() }],
                choosingDate: FRIDAY_PURCHASE_DATE,
            }
            const originalWeeksArepas = [...arepasDeCrhistian.availableWeeks]
            const originalWeeksRissoto = [...rissotoDeBoniato.availableWeeks]

            arepasDeCrhistian.availableWeeks = [...arepasDeCrhistian.availableWeeks, subscriptionResult.firstOrder.week]
            rissotoDeBoniato.availableWeeks = [...rissotoDeBoniato.availableWeeks, subscriptionResult.firstOrder.week]

            await chooseRecipesForOrderUseCase.execute(chooseRecipesForOrderDto)

            arepasDeCrhistian.availableWeeks = [...originalWeeksArepas]
            rissotoDeBoniato.availableWeeks = [...originalWeeksRissoto]

            const order: Order = await mockOrderRepository.findByIdOrThrow(subscriptionResult.firstOrder.id, Locale.es)
            const recipeRatings = await mockRecipeRatingRepository.findAllByCustomer(order.customer.id, Locale.es)

            expect(recipeRatings.length).toBe(2)
            expect(recipeRatings[0].recipe.id.toString()).toBe(arepasDeCrhistian.id.toString())
            expect(recipeRatings[1].recipe.id.toString()).toBe(rissotoDeBoniato.id.toString())
            mockRecipeRatingRepository.rates = []
        })

        it("Should create only 1 rating if the user chooses the same recipe more than once", async () => {
            const chooseRecipesForOrderDto: ChooseRecipesForOrderDto = {
                isAdminChoosing: false,
                orderId: subscriptionResult.firstOrder.id.toString(),
                recipeSelection: [{ quantity: 2, recipeId: arepasDeCrhistian.id.toString(), recipeVariantId: arepasDeCrhistian.recipeVariants[0].id.toString() }],
                choosingDate: FRIDAY_PURCHASE_DATE
            }
            const originalWeeksArepas = [...arepasDeCrhistian.availableWeeks]
            arepasDeCrhistian.availableWeeks = [...arepasDeCrhistian.availableWeeks, subscriptionResult.firstOrder.week]

            await chooseRecipesForOrderUseCase.execute(chooseRecipesForOrderDto)
            arepasDeCrhistian.availableWeeks = [...originalWeeksArepas]

            const order: Order = await mockOrderRepository.findByIdOrThrow(subscriptionResult.firstOrder.id, Locale.es)
            const recipeRatings = await mockRecipeRatingRepository.findAllByCustomer(order.customer.id, Locale.es)

            expect(recipeRatings.length).toBe(1)
            expect(recipeRatings[0].recipe.id.toString()).toBe(arepasDeCrhistian.id.toString())
            mockRecipeRatingRepository.rates = []
        })

        it("Should should assign the order shipping date value to the RecipeRatings", async () => {
            const chooseRecipesForOrderDto: ChooseRecipesForOrderDto = {
                isAdminChoosing: false,
                orderId: subscriptionResult.firstOrder.id.toString(),
                recipeSelection: [{ quantity: 2, recipeId: arepasDeCrhistian.id.toString(), recipeVariantId: arepasDeCrhistian.recipeVariants[0].id.toString() }],
                choosingDate: FRIDAY_PURCHASE_DATE
            }
            const originalWeeksArepas = [...arepasDeCrhistian.availableWeeks]
            arepasDeCrhistian.availableWeeks = [...arepasDeCrhistian.availableWeeks, subscriptionResult.firstOrder.week]

            await chooseRecipesForOrderUseCase.execute(chooseRecipesForOrderDto)
            arepasDeCrhistian.availableWeeks = [...originalWeeksArepas]


            const order: Order = await mockOrderRepository.findByIdOrThrow(subscriptionResult.firstOrder.id, Locale.es)
            const recipeRatings: RecipeRating[] = await mockRecipeRatingRepository.findAllByCustomer(order.customer.id, Locale.es)

            expect(recipeRatings.every((recipeRating) => recipeRating.shippingDates[0].getTime() === order.shippingDate.getTime())).toBe(true)
        })

        it("Should throw an error if the recipe is not available in the order week", async () => {
            const chooseRecipesForOrderDto: ChooseRecipesForOrderDto = {
                isAdminChoosing: false,
                orderId: subscriptionResult.firstOrder.id.toString(),
                recipeSelection: [{ quantity: 2, recipeId: arepasDeCrhistian.id.toString(), recipeVariantId: arepasDeCrhistian.recipeVariants[0].id.toString() }],
                choosingDate: FRIDAY_PURCHASE_DATE
            }
            const originalWeeksArepas = [...arepasDeCrhistian.availableWeeks]
            const testWeeks = await mockWeekRepository.findAll()
            // Finde me the week that 4 weeks after the order week
            const testWeek = testWeeks.find((week) => week.minDay.getTime() === subscriptionResult.firstOrder.week.minDay.getTime() + 4 * 7 * 24 * 60 * 60 * 1000)
            arepasDeCrhistian.availableWeeks = [...arepasDeCrhistian.availableWeeks, testWeek!]

            await expect(chooseRecipesForOrderUseCase.execute(chooseRecipesForOrderDto)).rejects.toThrow()
            arepasDeCrhistian.availableWeeks = [...originalWeeksArepas]
        })

        it("Should throw an error if the recipe is not related to the plan", async () => {
            const chooseRecipesForOrderDto: ChooseRecipesForOrderDto = {
                isAdminChoosing: false,
                orderId: subscriptionResult.firstOrder.id.toString(),
                recipeSelection: [{ quantity: 2, recipeId: burgerHallouli.id.toString(), recipeVariantId: burgerHallouli.recipeVariants[0].id.toString() }],
                choosingDate: FRIDAY_PURCHASE_DATE
            }
            await expect(chooseRecipesForOrderUseCase.execute(chooseRecipesForOrderDto)).rejects.toThrow()
        })

        it("Should throw an error if the user tries to choose more recipes than the plan variant has", async () => {
            const chooseRecipesForOrderDto: ChooseRecipesForOrderDto = {
                isAdminChoosing: false,
                orderId: subscriptionResult.firstOrder.id.toString(),
                recipeSelection: [{ quantity: 8, recipeId: arepasDeCrhistian.id.toString(), recipeVariantId: arepasDeCrhistian.recipeVariants[0].id.toString() }],
                choosingDate: FRIDAY_PURCHASE_DATE
            }
            await expect(chooseRecipesForOrderUseCase.execute(chooseRecipesForOrderDto)).rejects.toThrow()

        })

        it("Should throw an error if the user tries to choose less recipes than the plan variant has", async () => {
            const chooseRecipesForOrderDto: ChooseRecipesForOrderDto = {
                isAdminChoosing: false,
                orderId: subscriptionResult.firstOrder.id.toString(),
                recipeSelection: [{ quantity: 1, recipeId: arepasDeCrhistian.id.toString(), recipeVariantId: arepasDeCrhistian.recipeVariants[0].id.toString() }],
                choosingDate: FRIDAY_PURCHASE_DATE
            }
            await expect(chooseRecipesForOrderUseCase.execute(chooseRecipesForOrderDto)).rejects.toThrow()

        })

    })

    describe("When he chooses recipes on Saturday", () => {
        it("Should throw an error", async () => {
            const SATURDAY_PURCHASE_DATE = new Date(2023, 7, 5, 17)
            const chooseRecipesForOrderDto: ChooseRecipesForOrderDto = {
                isAdminChoosing: false,
                orderId: subscriptionResult.firstOrder.id.toString(),
                recipeSelection: [],
                choosingDate: SATURDAY_PURCHASE_DATE
            }

            const originalWeeksArepas = [...arepasDeCrhistian.availableWeeks]
            arepasDeCrhistian.availableWeeks = [...arepasDeCrhistian.availableWeeks, subscriptionResult.firstOrder.week]
            await expect(chooseRecipesForOrderUseCase.execute(chooseRecipesForOrderDto)).rejects.toThrow()
            arepasDeCrhistian.availableWeeks = [...originalWeeksArepas]
        })
    })
})

describe("Given a user with a brand new subscription purchased on Saturday", () => { })
describe("Update recipes selection", () => {
    const CUSTOMER_ID = new CustomerId()
    let customer: Customer
    let subscriptionResult: any
    const THURSDAY_PURCHASE_DATE: Date = new Date(2023, 7, 3, 17)

    beforeAll(async () => {
        customer = Customer.create(
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
        await mockCustomerRepository.save(customer)

        const createSubscriptionDto = {
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
            purchaseDate: THURSDAY_PURCHASE_DATE
        }
        subscriptionResult = await createSubscriptionUseCase.execute(createSubscriptionDto)
        const originalWeeksArepas = [...arepasDeCrhistian.availableWeeks]
        const originalWeeksRissoto = [...rissotoDeBoniato.availableWeeks]
        arepasDeCrhistian.availableWeeks = [...arepasDeCrhistian.availableWeeks, subscriptionResult.firstOrder.week]
        rissotoDeBoniato.availableWeeks = [...rissotoDeBoniato.availableWeeks, subscriptionResult.firstOrder.week]

        await chooseRecipesForOrderUseCase.execute({
            isAdminChoosing: false,
            orderId: subscriptionResult.firstOrder.id.toString(),
            recipeSelection: [{ quantity: 1, recipeId: arepasDeCrhistian.id.toString(), recipeVariantId: arepasDeCrhistian.recipeVariants[0].id.toString() }, { quantity: 1, recipeId: rissotoDeBoniato.id.toString(), recipeVariantId: rissotoDeBoniato.recipeVariants[0].id.toString() }],
            choosingDate: THURSDAY_PURCHASE_DATE
        })

        arepasDeCrhistian.availableWeeks = [...originalWeeksArepas]
        rissotoDeBoniato.availableWeeks = [...originalWeeksRissoto]
    })

    describe('When updates its recipe selection after the Friday 23:59', () => {
        it("Should throw an error", async () => {
            const FRIDAY_AFTER_PURCHASE_DATE = new Date(2023, 7, 5, 0, 0)
            const chooseRecipesForOrderDto: ChooseRecipesForOrderDto = {
                isAdminChoosing: false,
                orderId: subscriptionResult.firstOrder.id.toString(),
                recipeSelection: [{ quantity: 2, recipeId: arepasDeCrhistian.id.toString(), recipeVariantId: arepasDeCrhistian.recipeVariants[0].id.toString() }],
                choosingDate: FRIDAY_AFTER_PURCHASE_DATE
            }
            const originalWeeksArepas = [...arepasDeCrhistian.availableWeeks]
            arepasDeCrhistian.availableWeeks = [...arepasDeCrhistian.availableWeeks, subscriptionResult.firstOrder.week]
            await expect(chooseRecipesForOrderUseCase.execute(chooseRecipesForOrderDto)).rejects.toThrow()
            arepasDeCrhistian.availableWeeks = [...originalWeeksArepas]
        })
    })
})
// describe("Choose recipes for the second time or more")

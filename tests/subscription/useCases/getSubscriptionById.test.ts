import { GetSubscriptionById } from "../../../src/bounded_contexts/operations/useCases/getSubscriptionById/getSubscriptionById"
import { ChooseRecipesForOrder } from "../../../src/bounded_contexts/operations/useCases/chooseRecipesForOrder/chooseRecipesForOrder"
import { CreateSubscription } from "../../../src/bounded_contexts/operations/useCases/createSubscription/createSubscription"
import { CancelASubscription } from "../../../src/bounded_contexts/operations/useCases/cancelASubscription/cancelASubscription"
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
import { CreatePaymentOrders } from "../../../src/bounded_contexts/operations/services/createPaymentOrders/createPaymentOrders";
import { AssignOrdersToPaymentOrders } from "../../../src/bounded_contexts/operations/services/assignOrdersToPaymentOrders/assignOrdersToPaymentOrders";
import { Locale } from "../../../src/bounded_contexts/operations/domain/locale/Locale";
import { gourmetPlan, planVegetariano, planVegetarianoVariant2Persons2Recipes } from "../../mocks/plan";
import { arepasDeCrhistian, bowlDeQuinoa, burgerHallouli, rissotoDeBoniato } from "../../mocks/recipe";
import { CUSTOMER_ADDRESS_DETAILS, CUSTOMER_ADDRESS_NAME, CUSTOMER_EMAIL, CUSTOMER_FIRST_NAME, CUSTOMER_LAST_NAME, CUSTOMER_LATITUDE, CUSTOMER_LONGITUDE, CUSTOMER_PASSWORD, CUSTOMER_PHONE } from "../../mocks/customer"
import { ShippingZoneRadio } from "../../../src/bounded_contexts/operations/domain/shipping/ShippingZoneRadio/ShippingZoneRadio";
import { Coordinates } from "../../../src/bounded_contexts/operations/domain/shipping/ShippingZoneRadio/Coordinates";
import { TUESDAY } from "../../mocks/days";
import { ShippingZone } from "../../../src/bounded_contexts/operations/domain/shipping/ShippingZone";
import { IMailingListService } from "../../../src/bounded_contexts/operations/application/mailingListService/IMailingListService";
import { MockMailingListService } from "../../../src/bounded_contexts/operations/application/mailingListService/mockMailingListService";
import { CreateSubscriptionDto } from "../../../src/bounded_contexts/operations/useCases/createSubscription/createSubscriptionDto";
import { GetSubscriptionByIdPresenter } from "../../../src/bounded_contexts/operations/useCases/getSubscriptionById/getSubscriptionByIdPresenter"
import { MockStorageService } from "../../../src/bounded_contexts/operations/application/storageService/mockStorageService"
import { PlanFrequencyFactory } from "../../../src/bounded_contexts/operations/domain/plan/PlanFrequency/PlanFrequencyFactory"
import { CancelASubscriptionDto } from "../../../src/bounded_contexts/operations/useCases/cancelASubscription/cancelASubscriptionDto"


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
mockRecipeRepository.save(bowlDeQuinoa)

const mockCreateFriendCodeService = new CreateFriendCode(mockCouponRepository, mockCustomerRepository)
const createPaymentOrdersService: CreatePaymentOrders = new CreatePaymentOrders()
const assignOrdersToPaymentOrderService = new AssignOrdersToPaymentOrders(mockPaymentOrderRepository, createPaymentOrdersService)
const mockMailingListService: IMailingListService = new MockMailingListService()


const createSubscriptionUseCase = new CreateSubscription(mockCustomerRepository, mockSubscriptionRepository, mockShippingZoneRepository, mockPlanRepository, mockWeekRepository, mockOrderRepository, mockCouponRepository, mockPaymentService, mockNotificationService, assignOrdersToPaymentOrderService, mockPaymentOrderRepository, mockLogRepository, mockCreateFriendCodeService)
const chooseRecipesForOrderUseCase = new ChooseRecipesForOrder(mockOrderRepository, mockRecipeRepository, mockPaymentOrderRepository, mockLogRepository, mockRecipeRatingRepository)
const cancelASubscriptionUseCase = new CancelASubscription(mockSubscriptionRepository, mockOrderRepository, mockPaymentOrderRepository, mockNotificationService, mockMailingListService, mockLogRepository, mockRecipeRatingRepository)

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

const mockStorageService = new MockStorageService()
const getSubscriptionByIdPresenter = new GetSubscriptionByIdPresenter(mockStorageService)
const getSubscriptionById: GetSubscriptionById = new GetSubscriptionById(mockSubscriptionRepository, mockOrderRepository, mockPaymentOrderRepository, mockWeekRepository, getSubscriptionByIdPresenter)

describe('Get Subscription By Id', () => {
    describe("Given a user with a subscription purchased at a Monday and querying it the same day", () => {
        const PURCHASE_DATE: Date = new Date(2023, 7, 21, 17)
        const QUERY_DATE: Date = new Date(2023, 7, 21, 17, 15)
        const CUSTOMER_ID = new CustomerId()
        let createSubscriptionUseCaseResponse: any
        let subscription: Subscription
        let customer: Customer

        beforeAll(async () => {
            customer = Customer.create(CUSTOMER_EMAIL,
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
                CUSTOMER_ID)
            mockCustomerRepository.save(customer)

            const createSubscriptionDto: CreateSubscriptionDto = {
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
            createSubscriptionUseCaseResponse = await createSubscriptionUseCase.execute(createSubscriptionDto)
            subscription = createSubscriptionUseCaseResponse.subscription
        })

        describe("When the user quries with a wrong id", () => {
            it("Should throw an error", async () => {
                const wrongId = "wrongId"
                const getSubscriptionByIdDto = { subscriptionId: wrongId, locale: Locale.es, queryDate: QUERY_DATE }
                await expect(getSubscriptionById.execute(getSubscriptionByIdDto)).rejects.toThrow()
            })
        })

        describe("When the user queries with the correct id", () => {
            it("Should return the subscription id", async () => {
                const getSubscriptionByIdDto = { subscriptionId: subscription.id.toString(), locale: Locale.es, queryDate: QUERY_DATE }
                const getSubscriptionByIdResponse = await getSubscriptionById.execute(getSubscriptionByIdDto)

                expect(getSubscriptionByIdResponse.subscriptionId).toEqual(subscription.id.toString())
            })

            it("Should return the subscription plan id", async () => {
                const getSubscriptionByIdDto = { subscriptionId: subscription.id.toString(), locale: Locale.es, queryDate: QUERY_DATE }
                const getSubscriptionByIdResponse = await getSubscriptionById.execute(getSubscriptionByIdDto)

                expect(getSubscriptionByIdResponse.plan.id).toEqual(subscription.plan.id.toString())
            })

            it("Should return the subscription plan variant", async () => {
                const getSubscriptionByIdDto = { subscriptionId: subscription.id.toString(), locale: Locale.es, queryDate: QUERY_DATE }
                const getSubscriptionByIdResponse = await getSubscriptionById.execute(getSubscriptionByIdDto)

                expect(getSubscriptionByIdResponse.actualPlanVariant.id).toEqual(subscription.planVariantId.toString())
                expect(getSubscriptionByIdResponse.actualPlanVariant.description).toEqual(planVegetarianoVariant2Persons2Recipes.getLabelWithPrice(Locale.es))
                expect(getSubscriptionByIdResponse.actualPlanVariant.price).toEqual(planVegetarianoVariant2Persons2Recipes.priceWithOffer ?? planVegetarianoVariant2Persons2Recipes.price)
                expect(getSubscriptionByIdResponse.actualPlanVariant.isDefault).toEqual(planVegetarianoVariant2Persons2Recipes.isDefault)
                expect(getSubscriptionByIdResponse.actualPlanVariant.numberOfPersons).toEqual(planVegetarianoVariant2Persons2Recipes.numberOfPersons)
                expect(getSubscriptionByIdResponse.actualPlanVariant.numberOfRecipes).toEqual(planVegetarianoVariant2Persons2Recipes.numberOfRecipes)
            })

            it("Should return if the subscription is a one time", async () => {
                const getSubscriptionByIdDto = { subscriptionId: subscription.id.toString(), locale: Locale.es, queryDate: QUERY_DATE }
                const getSubscriptionByIdResponse = await getSubscriptionById.execute(getSubscriptionByIdDto)

                expect(getSubscriptionByIdResponse.isOneTime).toEqual(subscription.frequency === PlanFrequencyFactory.createPlanFrequency("one_time"))
            })

            it("Should return the shipping address", async () => {
                const getSubscriptionByIdDto = { subscriptionId: subscription.id.toString(), locale: Locale.es, queryDate: QUERY_DATE }
                const getSubscriptionByIdResponse = await getSubscriptionById.execute(getSubscriptionByIdDto)

                expect(getSubscriptionByIdResponse.shippingAddress.addressName).toEqual(CUSTOMER_ADDRESS_NAME)
                expect(getSubscriptionByIdResponse.shippingAddress.addressDetails).toEqual(CUSTOMER_ADDRESS_DETAILS)
                expect(getSubscriptionByIdResponse.shippingAddress.preferredSchedule).toEqual(customer.shippingAddress?.deliveryTime?.getLabel(Locale.es) ?? "")
            })

            it("Should return the payment method or null", async () => {
                const customerPaymentPethod = customer.getDefaultPaymentMethod()
                const getSubscriptionByIdDto = { subscriptionId: subscription.id.toString(), locale: Locale.es, queryDate: QUERY_DATE }
                const getSubscriptionByIdResponse = await getSubscriptionById.execute(getSubscriptionByIdDto)

                if (!customerPaymentPethod) expect(getSubscriptionByIdResponse.paymentMethod).toBeNull()
                else {
                    expect(getSubscriptionByIdResponse.paymentMethod?.cardLabel).toEqual(customerPaymentPethod.getCardLabel(Locale.es))
                    expect(getSubscriptionByIdResponse.paymentMethod?.default).toEqual(customerPaymentPethod.isDefault)
                    expect(getSubscriptionByIdResponse.paymentMethod?.id).toEqual(customerPaymentPethod.id.toString())
                    expect(getSubscriptionByIdResponse.paymentMethod?.expirationDateLabel).toEqual(customer.getDefaultPaymentMethodExpirationDateLabel(Locale.es))
                }
            })

            it("Should return the schedule", async () => {
                const getSubscriptionByIdDto = { subscriptionId: subscription.id.toString(), locale: Locale.es, queryDate: QUERY_DATE }
                const getSubscriptionByIdResponse = await getSubscriptionById.execute(getSubscriptionByIdDto)

                expect(getSubscriptionByIdResponse.schedule.nextDelivery).toEqual("martes 29º agosto")
                expect(getSubscriptionByIdResponse.schedule.nextPayment).toEqual("sábado 2º septiembre")
            })

            it("Should return false as hasChosenRecipesForActualWeek", async () => {
                const getSubscriptionByIdDto = { subscriptionId: subscription.id.toString(), locale: Locale.es, queryDate: QUERY_DATE }
                const getSubscriptionByIdResponse = await getSubscriptionById.execute(getSubscriptionByIdDto)

                expect(getSubscriptionByIdResponse.hasChosenRecipesForActualWeek).toEqual(false)
            })

            it("Should return false as hasChosenRecipesForNextWeek", async () => {
                const getSubscriptionByIdDto = { subscriptionId: subscription.id.toString(), locale: Locale.es, queryDate: QUERY_DATE }
                const getSubscriptionByIdResponse = await getSubscriptionById.execute(getSubscriptionByIdDto)

                expect(getSubscriptionByIdResponse.hasChosenRecipesForNextWeek).toEqual(false)
            })

            it("Should return the next week order info", async () => {
                const getSubscriptionByIdDto = { subscriptionId: subscription.id.toString(), locale: Locale.es, queryDate: QUERY_DATE }
                const getSubscriptionByIdResponse = await getSubscriptionById.execute(getSubscriptionByIdDto)
                const billedOrder = createSubscriptionUseCaseResponse.firstOrder

                expect(getSubscriptionByIdResponse.nextWeekOrder?.id).toEqual(billedOrder.id.toString())
                expect(getSubscriptionByIdResponse.nextWeekOrder?.shippingDate).toEqual("martes 29º agosto")
                expect(getSubscriptionByIdResponse.nextWeekOrder?.weekLabel).toBeDefined()
            })

            it("Should return true as canChooseRecipesForNextWeekOrder", async () => {
                const getSubscriptionByIdDto = { subscriptionId: subscription.id.toString(), locale: Locale.es, queryDate: QUERY_DATE }
                const getSubscriptionByIdResponse = await getSubscriptionById.execute(getSubscriptionByIdDto)

                expect(getSubscriptionByIdResponse.canChooseRecipesForNextWeekOrder).toEqual(true)
            })

            it("Should return the skipped orders", async () => {
                const getSubscriptionByIdDto = { subscriptionId: subscription.id.toString(), locale: Locale.es, queryDate: QUERY_DATE }
                const getSubscriptionByIdResponse = await getSubscriptionById.execute(getSubscriptionByIdDto)

                expect(getSubscriptionByIdResponse.skippedOrders.length).toEqual(0)
            })

            it("Should return if the plan is able to choose recipes", async () => {
                const getSubscriptionByIdDto = { subscriptionId: subscription.id.toString(), locale: Locale.es, queryDate: QUERY_DATE }
                const getSubscriptionByIdResponse = await getSubscriptionById.execute(getSubscriptionByIdDto)

                expect(getSubscriptionByIdResponse.canChooseRecipes).toBeTruthy()
            })

            it("Should return the next 11 orders", async () => {
                const getSubscriptionByIdDto = { subscriptionId: subscription.id.toString(), locale: Locale.es, queryDate: QUERY_DATE }
                const getSubscriptionByIdResponse = await getSubscriptionById.execute(getSubscriptionByIdDto)

                getSubscriptionByIdResponse.nextTwelveOrders.forEach((order, index) => {
                    expect(order.id).toBeDefined()
                    expect(order.weekLabel).toBeDefined()
                    expect(order.isReanudable).toBeDefined()
                    expect(order.shippingDate).toBeDefined()
                    expect(order.isSkipped).toBeDefined()
                    expect(order.state).toBeDefined()
                })

                expect(getSubscriptionByIdResponse.nextTwelveOrders.length).toEqual(12)

            })

            it("Should return true if the plan has recipes asscioated", async () => {
                const getSubscriptionByIdDto = { subscriptionId: subscription.id.toString(), locale: Locale.es, queryDate: QUERY_DATE }
                const getSubscriptionByIdResponse = await getSubscriptionById.execute(getSubscriptionByIdDto)

                expect(getSubscriptionByIdResponse.hasRecipes).toEqual(subscription.plan.hasRecipes)
            })

            it("Should return the shipping cost", async () => {
                const getSubscriptionByIdDto = { subscriptionId: subscription.id.toString(), locale: Locale.es, queryDate: QUERY_DATE }
                const response = await getSubscriptionById.execute(getSubscriptionByIdDto)

                expect(response.shippingCost).toEqual(MOCK_SHIPPING_COST)
            })

            it("Should return the portions quantity", async () => {
                const getSubscriptionByIdDto = { subscriptionId: subscription.id.toString(), locale: Locale.es, queryDate: QUERY_DATE }
                const response = await getSubscriptionById.execute(getSubscriptionByIdDto)

                expect(response.portionsQuantity).toEqual(4)
            })

            it("Should return the porcion price", async () => {
                const getSubscriptionByIdDto = { subscriptionId: subscription.id.toString(), locale: Locale.es, queryDate: QUERY_DATE }
                const response = await getSubscriptionById.execute(getSubscriptionByIdDto)

                expect(response.portionPrice).toEqual(6.62)
            })
        })


        describe("Given a subscription purchased on Saturday", () => {
            const PURCHASE_DATE: Date = new Date(2023, 7, 19, 17)
            const QUERY_DATE: Date = new Date(2023, 7, 19, 17, 15)
            const CUSTOMER_ID = new CustomerId()
            let subscription: Subscription

            beforeAll(async () => {
                mockCustomerRepository.save(Customer.create(CUSTOMER_EMAIL,
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
                    CUSTOMER_ID))

                const createSubscriptionDto: CreateSubscriptionDto = {
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
                const createSubscriptionUseCaseResponse = await createSubscriptionUseCase.execute(createSubscriptionDto)
                subscription = createSubscriptionUseCaseResponse.subscription
            })

            describe("When the user queries with the correct id", () => {
                it("Should not be able to choose recipes for the current week", async () => {
                    const getSubscriptionByIdDto = { subscriptionId: subscription.id.toString(), locale: Locale.es, queryDate: QUERY_DATE }
                    const getSubscriptionByIdResponse = await getSubscriptionById.execute(getSubscriptionByIdDto)

                    expect(getSubscriptionByIdResponse.hasChosenRecipesForActualWeek).toEqual(false)
                })

                it("Should not be able to choose recipes for the next week", async () => {
                    const getSubscriptionByIdDto = { subscriptionId: subscription.id.toString(), locale: Locale.es, queryDate: QUERY_DATE }
                    const getSubscriptionByIdResponse = await getSubscriptionById.execute(getSubscriptionByIdDto)

                    expect(getSubscriptionByIdResponse.hasChosenRecipesForNextWeek).toEqual(false)
                })
            })
        })
    })

    describe("Given a cancelled subscription", () => {
        const PURCHASE_DATE: Date = new Date(2023, 7, 21, 17)
        const CANCELLATION_DATE: Date = new Date(2023, 7, 21, 17, 10)
        const QUERY_DATE: Date = new Date(2023, 7, 21, 17, 15)
        const CUSTOMER_ID = new CustomerId()
        let createSubscriptionUseCaseResponse: any
        let subscription: Subscription
        let customer: Customer

        beforeAll(async () => {
            customer = Customer.create(CUSTOMER_EMAIL,
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
                CUSTOMER_ID)
            mockCustomerRepository.save(customer)

            const createSubscriptionDto: CreateSubscriptionDto = {
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
            createSubscriptionUseCaseResponse = await createSubscriptionUseCase.execute(createSubscriptionDto)
            subscription = createSubscriptionUseCaseResponse.subscription

            const cancelSubscriptionDTO: CancelASubscriptionDto = {
                cancellationComment: "string",
                cancellationReason: "string",
                queryDate: CANCELLATION_DATE,
                subscriptionId: subscription.id.toString()
            }

            await cancelASubscriptionUseCase.execute(cancelSubscriptionDTO)
        })

        describe("When the user queries before the shipping date", () => {
            it("Should return the subscription id", async () => {
                const getSubscriptionByIdDto = { subscriptionId: subscription.id.toString(), locale: Locale.es, queryDate: QUERY_DATE }
                const getSubscriptionByIdResponse = await getSubscriptionById.execute(getSubscriptionByIdDto)

                expect(getSubscriptionByIdResponse.subscriptionId).toEqual(subscription.id.toString())
            })

            it("Should return the subscription plan id", async () => {
                const getSubscriptionByIdDto = { subscriptionId: subscription.id.toString(), locale: Locale.es, queryDate: QUERY_DATE }
                const getSubscriptionByIdResponse = await getSubscriptionById.execute(getSubscriptionByIdDto)

                expect(getSubscriptionByIdResponse.plan.id).toEqual(subscription.plan.id.toString())
            })

            it("Should return the subscription plan variant", async () => {
                const getSubscriptionByIdDto = { subscriptionId: subscription.id.toString(), locale: Locale.es, queryDate: QUERY_DATE }
                const getSubscriptionByIdResponse = await getSubscriptionById.execute(getSubscriptionByIdDto)

                expect(getSubscriptionByIdResponse.actualPlanVariant.id).toEqual(subscription.planVariantId.toString())
                expect(getSubscriptionByIdResponse.actualPlanVariant.description).toEqual(planVegetarianoVariant2Persons2Recipes.getLabelWithPrice(Locale.es))
                expect(getSubscriptionByIdResponse.actualPlanVariant.price).toEqual(planVegetarianoVariant2Persons2Recipes.priceWithOffer ?? planVegetarianoVariant2Persons2Recipes.price)
                expect(getSubscriptionByIdResponse.actualPlanVariant.isDefault).toEqual(planVegetarianoVariant2Persons2Recipes.isDefault)
                expect(getSubscriptionByIdResponse.actualPlanVariant.numberOfPersons).toEqual(planVegetarianoVariant2Persons2Recipes.numberOfPersons)
                expect(getSubscriptionByIdResponse.actualPlanVariant.numberOfRecipes).toEqual(planVegetarianoVariant2Persons2Recipes.numberOfRecipes)
            })

            it("Should return if the subscription is a one time", async () => {
                const getSubscriptionByIdDto = { subscriptionId: subscription.id.toString(), locale: Locale.es, queryDate: QUERY_DATE }
                const getSubscriptionByIdResponse = await getSubscriptionById.execute(getSubscriptionByIdDto)

                expect(getSubscriptionByIdResponse.isOneTime).toEqual(subscription.frequency === PlanFrequencyFactory.createPlanFrequency("one_time"))
            })

            it("Should return the shipping address", async () => {
                const getSubscriptionByIdDto = { subscriptionId: subscription.id.toString(), locale: Locale.es, queryDate: QUERY_DATE }
                const getSubscriptionByIdResponse = await getSubscriptionById.execute(getSubscriptionByIdDto)

                expect(getSubscriptionByIdResponse.shippingAddress.addressName).toEqual(CUSTOMER_ADDRESS_NAME)
                expect(getSubscriptionByIdResponse.shippingAddress.addressDetails).toEqual(CUSTOMER_ADDRESS_DETAILS)
                expect(getSubscriptionByIdResponse.shippingAddress.preferredSchedule).toEqual(customer.shippingAddress?.deliveryTime?.getLabel(Locale.es) ?? "")
            })

            it("Should return the payment method or null", async () => {
                const customerPaymentPethod = customer.getDefaultPaymentMethod()
                const getSubscriptionByIdDto = { subscriptionId: subscription.id.toString(), locale: Locale.es, queryDate: QUERY_DATE }
                const getSubscriptionByIdResponse = await getSubscriptionById.execute(getSubscriptionByIdDto)

                if (!customerPaymentPethod) expect(getSubscriptionByIdResponse.paymentMethod).toBeNull()
                else {
                    expect(getSubscriptionByIdResponse.paymentMethod?.cardLabel).toEqual(customerPaymentPethod.getCardLabel(Locale.es))
                    expect(getSubscriptionByIdResponse.paymentMethod?.default).toEqual(customerPaymentPethod.isDefault)
                    expect(getSubscriptionByIdResponse.paymentMethod?.id).toEqual(customerPaymentPethod.id.toString())
                    expect(getSubscriptionByIdResponse.paymentMethod?.expirationDateLabel).toEqual(customer.getDefaultPaymentMethodExpirationDateLabel(Locale.es))
                }
            })

            it("Should return the schedule", async () => {
                const getSubscriptionByIdDto = { subscriptionId: subscription.id.toString(), locale: Locale.es, queryDate: QUERY_DATE }
                const getSubscriptionByIdResponse = await getSubscriptionById.execute(getSubscriptionByIdDto)

                expect(getSubscriptionByIdResponse.schedule.nextDelivery).toEqual("martes 29º agosto")
                expect(getSubscriptionByIdResponse.schedule.nextPayment).toEqual("")
            })

            it("Should return false as hasChosenRecipesForActualWeek", async () => {
                const getSubscriptionByIdDto = { subscriptionId: subscription.id.toString(), locale: Locale.es, queryDate: QUERY_DATE }
                const getSubscriptionByIdResponse = await getSubscriptionById.execute(getSubscriptionByIdDto)

                expect(getSubscriptionByIdResponse.hasChosenRecipesForActualWeek).toEqual(false)
            })

            it("Should return false as hasChosenRecipesForNextWeek", async () => {
                const getSubscriptionByIdDto = { subscriptionId: subscription.id.toString(), locale: Locale.es, queryDate: QUERY_DATE }
                const getSubscriptionByIdResponse = await getSubscriptionById.execute(getSubscriptionByIdDto)

                expect(getSubscriptionByIdResponse.hasChosenRecipesForNextWeek).toEqual(false)
            })

            it("Should return the next week order info", async () => {
                const getSubscriptionByIdDto = { subscriptionId: subscription.id.toString(), locale: Locale.es, queryDate: QUERY_DATE }
                const getSubscriptionByIdResponse = await getSubscriptionById.execute(getSubscriptionByIdDto)
                const billedOrder = createSubscriptionUseCaseResponse.firstOrder

                expect(getSubscriptionByIdResponse.nextWeekOrder?.id).toEqual(billedOrder.id.toString())
                expect(getSubscriptionByIdResponse.nextWeekOrder?.shippingDate).toEqual("martes 29º agosto")
                expect(getSubscriptionByIdResponse.nextWeekOrder?.weekLabel).toBeDefined()
            })

            it("Should return true as canChooseRecipesForNextWeekOrder", async () => {
                const getSubscriptionByIdDto = { subscriptionId: subscription.id.toString(), locale: Locale.es, queryDate: QUERY_DATE }
                const getSubscriptionByIdResponse = await getSubscriptionById.execute(getSubscriptionByIdDto)

                expect(getSubscriptionByIdResponse.canChooseRecipesForNextWeekOrder).toEqual(true)
            })

            it("Should return the skipped orders", async () => {
                const getSubscriptionByIdDto = { subscriptionId: subscription.id.toString(), locale: Locale.es, queryDate: QUERY_DATE }
                const getSubscriptionByIdResponse = await getSubscriptionById.execute(getSubscriptionByIdDto)

                expect(getSubscriptionByIdResponse.skippedOrders.length).toEqual(0)
            })

            it("Should return if the plan is able to choose recipes", async () => {
                const getSubscriptionByIdDto = { subscriptionId: subscription.id.toString(), locale: Locale.es, queryDate: QUERY_DATE }
                const getSubscriptionByIdResponse = await getSubscriptionById.execute(getSubscriptionByIdDto)

                expect(getSubscriptionByIdResponse.canChooseRecipes).toBeTruthy()
            })

            it("Should return the next 11 orders", async () => {
                const getSubscriptionByIdDto = { subscriptionId: subscription.id.toString(), locale: Locale.es, queryDate: QUERY_DATE }
                const getSubscriptionByIdResponse = await getSubscriptionById.execute(getSubscriptionByIdDto)

                getSubscriptionByIdResponse.nextTwelveOrders.forEach((order, index) => {
                    expect(order.id).toBeDefined()
                    expect(order.weekLabel).toBeDefined()
                    expect(order.isReanudable).toBeDefined()
                    expect(order.shippingDate).toBeDefined()
                    expect(order.isSkipped).toBeDefined()
                    expect(order.state).toBeDefined()
                })

                expect(getSubscriptionByIdResponse.nextTwelveOrders.length).toEqual(12)

            })

            it("Should return true if the plan has recipes asscioated", async () => {
                const getSubscriptionByIdDto = { subscriptionId: subscription.id.toString(), locale: Locale.es, queryDate: QUERY_DATE }
                const getSubscriptionByIdResponse = await getSubscriptionById.execute(getSubscriptionByIdDto)

                expect(getSubscriptionByIdResponse.hasRecipes).toEqual(subscription.plan.hasRecipes)
            })

            it("Should return the shipping cost", async () => {
                const getSubscriptionByIdDto = { subscriptionId: subscription.id.toString(), locale: Locale.es, queryDate: QUERY_DATE }
                const response = await getSubscriptionById.execute(getSubscriptionByIdDto)

                expect(response.shippingCost).toEqual(MOCK_SHIPPING_COST)
            })

            it("Should return the portions quantity", async () => {
                const getSubscriptionByIdDto = { subscriptionId: subscription.id.toString(), locale: Locale.es, queryDate: QUERY_DATE }
                const response = await getSubscriptionById.execute(getSubscriptionByIdDto)

                expect(response.portionsQuantity).toEqual(4)
            })

            it("Should return the porcion price", async () => {
                const getSubscriptionByIdDto = { subscriptionId: subscription.id.toString(), locale: Locale.es, queryDate: QUERY_DATE }
                const response = await getSubscriptionById.execute(getSubscriptionByIdDto)

                expect(response.portionPrice).toEqual(6.62)
            })
        })
    })
})
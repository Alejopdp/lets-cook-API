import moment from "moment";
import { IExportService } from "../../application/exportService/IExportService";
import { MomentTimeService } from "../../application/timeService/momentTimeService";
import { Customer } from "../../domain/customer/Customer";
import { Locale } from "../../domain/locale/Locale";
import { Order } from "../../domain/order/Order";
import { RecipeVariantRestriction } from "../../domain/recipe/RecipeVariant/recipeVariantResitriction/RecipeVariantRestriction";
import { RecipeRating } from "../../domain/recipeRating/RecipeRating";
import { Subscription } from "../../domain/subscription/Subscription";
import { SubscriptionId } from "../../domain/subscription/SubscriptionId";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { IRateRepository } from "../../infra/repositories/rate/IRateRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { ExportRecipeRatingsDto } from "./exportRecipeRatingsDto";
import { performance } from 'perf_hooks';

export interface RecipeRatingExportRow {
    email: string;
    nombre: string;
    apellido: string;
    codigoMGM: string;
    plan: string;
    "Cantidad de personas del plan": number;
    "Cantidad de recetas del plan": number;
    ciudad: string;
    "Fecha review": string;
    "Fecha consumo": string;
    "Valoración": number | string;
    "Comentario": string;
    "Código SKU receta": string;
    "Variante SKU receta": string;
    "Nombre receta": string;
    "Modificación": string
    "Cantidad de entregas": number;
}

export class ExportRecipeRatings {
    private _recipeRatingRepository: IRateRepository;
    private _customerRepository: ICustomerRepository;
    private _orderRepository: IOrderRepository;
    private _subscriptionRepository: ISubscriptionRepository;
    private _exportService: IExportService;

    constructor(recipeRatingRepository: IRateRepository, customerRepository: ICustomerRepository, orderRepository: IOrderRepository, subscriptionRepository: ISubscriptionRepository, exportService: IExportService) {
        this._recipeRatingRepository = recipeRatingRepository;
        this._customerRepository = customerRepository;
        this._orderRepository = orderRepository;
        this._subscriptionRepository = subscriptionRepository;
        this._exportService = exportService;
    }

    public async execute(dto: ExportRecipeRatingsDto): Promise<any> {
        const rows: RecipeRatingExportRow[] = [];
        const ratingsFilter: any = { rating: { "$gt": 0 } }
        if (dto.shippingDate) ratingsFilter["shippingDates"] = { "$elemMatch": { "$gte": dto.shippingDate } };
        const [recipeRatings, customers]: [RecipeRating[], Customer[]] = await Promise.all([this.recipeRatingRepository.findBy(ratingsFilter, Locale.es), this.customerRepository.findAll()]);
        const customersMap = new Map<string, Customer>();
        const customer_recipe_tuples: [string, string][] = recipeRatings.map(rating => [rating.customerId.toString(), rating.recipe.id.toString()])
        const customerRecipeOrderMap = new Map<string, Order[]>();
        const start = performance.now();
        const memory_start = process.memoryUsage().heapUsed / 1024 / 1024;
        let ordersFilter: any = { state: { $in: ["ORDER_BILLED"], }, deletionFlag: false, "recipeSelection.0": { "$exists": true } }
        if (dto.shippingDate) ordersFilter["shippingDate"] = { "$gte": dto.shippingDate };

        const orders = (await this.orderRepository.findBy(ordersFilter, Locale.es))
        const ordersMap = new Map<string, Order[]>();
        orders.forEach(order => {
            order.recipeSelection.forEach(recipeSelection => {
                const key = `${order.customer.id.toString()}_${recipeSelection.recipe.id.toString()}`;
                if (customer_recipe_tuples.some(tuple => tuple[0] === order.customer.id.toString() && tuple[1] === recipeSelection.recipe.id.toString())) ordersMap.set(key, [...(ordersMap.get(key) || []), order]);
            })
        });
        const memory_end = process.memoryUsage().heapUsed / 1024 / 1024;
        console.log("Memory used: ", memory_end - memory_start);

        customer_recipe_tuples.forEach(tuple => {
            const key = `${tuple[0]}_${tuple[1]}`;
            customerRecipeOrderMap.set(key, ordersMap.get(key) || []);
        });

        // Populte the customerRecipeOrderMap, using the customer_recipe_tuples as keys and the orders as values. The orders should match de filter criteria



        // const orderPromises: Promise<void>[] = customer_recipe_tuples.map(async (tuple) => {
        //     const orders = await this.orderRepository.getOrdersForRecipeRatingsExport(tuple, Locale.es);
        //     const key = `${tuple[0]}_${tuple[1]}`;
        //     customerRecipeOrderMap.set(key, orders);
        // });



        // await Promise.all(orderPromises);
        const end = performance.now();
        console.log("Orders took: ", (end - start) / 1000)
        const start_process = performance.now();


        const allSubscriptionIds = Array.from(customerRecipeOrderMap.values()).reduce((acc, orders) => {
            const subscriptionIds = orders.map(order => order.subscriptionId);

            return [...acc, ...subscriptionIds];
        }, [] as SubscriptionId[]);

        const allSubscriptions = await this.subscriptionRepository.findByIdList(allSubscriptionIds);
        // Mapear las suscripciones por su ID para un acceso rápido
        const subscriptionMap = new Map<string, Subscription | undefined>(
            allSubscriptions.map(sub => [sub.id.toString(), sub])
        );


        for (let customer of customers) {
            customersMap.set(customer.id.toString(), customer);
        }

        for (let rating of recipeRatings) {
            if (!rating.isRated()) continue;
            const customerAndRecipeOrders = customerRecipeOrderMap.get(`${rating.customerId.toString()}_${rating.recipe.id.toString()}`) ?? [];
            if (customerAndRecipeOrders.length === 0) continue;
            const { order: orderForExport, restriction } = this.getOrderForExport(rating, customerRecipeOrderMap.get(`${rating.customerId.toString()}_${rating.recipe.id.toString()}`) ?? [], subscriptionMap)
            if (!orderForExport) continue;

            let alreadyAddedRatingToExport = false

            for (let i = 0; i < rating.shippingDates.length; i++) {
                if (dto.shippingDate && moment(rating.shippingDates[i]).isBefore(dto.shippingDate)) continue;
                const planVariant = orderForExport.plan.getPlanVariantById(orderForExport.planVariantId);
                const recipeSelection = orderForExport.recipeSelection.find(selection => selection.recipe.id.toString() === rating.recipe.id.toString())
                const recipeVariantOfOrder = recipeSelection?.recipe.recipeVariants.find(recipeVariant => !restriction ? recipeVariant.restriction.value === "apto_todo" : recipeVariant.restriction.id.equals(restriction.id))

                rows.push({
                    email: customersMap.get(rating.customerId.toString())?.email ?? "",
                    nombre: customersMap.get(rating.customerId.toString())?.getPersonalInfo().name ?? "",
                    apellido: customersMap.get(rating.customerId.toString())?.getPersonalInfo().lastName ?? "",
                    codigoMGM: customersMap.get(rating.customerId.toString())?.friendCode ?? "",
                    plan: orderForExport.plan.name,
                    "Cantidad de personas del plan": planVariant?.getServingsQuantity() ?? 0,
                    "Cantidad de recetas del plan": planVariant?.getNumberOfRecipes() ?? 0,
                    ciudad: customersMap.get(rating.customerId.toString())?.getShippingAddress().city ?? "",
                    "Fecha review": rating.ratingDate?.toISOString() ?? rating.updatedAt.toISOString(),
                    "Fecha consumo": rating.shippingDates[i].toISOString(),
                    "Valoración": !alreadyAddedRatingToExport ? rating.rating ?? "" : "",
                    "Comentario": rating.comment ?? "",
                    "Código SKU receta": rating.recipe.recipeGeneralData.recipeSku.code,
                    "Variante SKU receta": recipeVariantOfOrder?.sku.code ?? "",
                    "Nombre receta": rating.recipe.getName(),
                    "Modificación": "Solamente se guarda 1 linea y definimos que se guarda la primera vez que lo valora",
                    "Cantidad de entregas": rating.getQtyDelivered(dto.queryDate)
                })

                alreadyAddedRatingToExport = true;
            }
        }

        const end_process = performance.now();
        console.log("Process took: ", (end_process - start_process) / 1000)
        this.exportService.exportRecipeRatings(rows);

    }

    private getOrderForExport(recipeRating: RecipeRating, orders: Order[], subscriptionMap: Map<string, Subscription | undefined>): { order: Order, restriction: RecipeVariantRestriction | undefined } {
        let restriction: RecipeVariantRestriction | undefined;
        // Obtener todos los ids de suscripción de las ordenes sin duplicados
        const uniqueSubscriptionIds = Array.from(new Set(orders.map(order => order.subscriptionId)));

        // Usar el mapa de suscripciones en lugar de realizar consultas adicionales
        const subscriptions = uniqueSubscriptionIds.map(id => subscriptionMap.get(id.toString()) ?? undefined);

        // Si hay varias suscripciones y solo 1 tiene una restricción, me quedo con sus ordenes
        if (subscriptions.length > 1) {
            const subscriptionsWithRestrictions = subscriptions.filter(subscription => !!subscription?.restriction);

            if (subscriptionsWithRestrictions.length === 1) {
                orders = orders.filter(order => order.subscriptionId === subscriptionsWithRestrictions[0]?.id);
                restriction = subscriptionsWithRestrictions[0]?.restriction;
            }

            if (subscriptionsWithRestrictions.length > 1) {
                const aptoVeganoSinGluten = subscriptionsWithRestrictions.find(subscription => subscription?.restriction?.value === "VG");
                if (aptoVeganoSinGluten) {
                    orders = orders.filter(order => order.subscriptionId === aptoVeganoSinGluten.id);
                    restriction = aptoVeganoSinGluten.restriction;
                } else {
                    const vegano = subscriptionsWithRestrictions.find(subscription => subscription?.restriction?.value === "VE");
                    if (vegano) {
                        orders = orders.filter(order => order.subscriptionId === vegano.id);
                        restriction = vegano.restriction;
                    }
                    else {
                        const sinGlutenYLactosa = subscriptionsWithRestrictions.find(subscription => subscription?.restriction?.value === "LG");
                        if (sinGlutenYLactosa) {
                            orders = orders.filter(order => order.subscriptionId === sinGlutenYLactosa.id);
                            restriction = sinGlutenYLactosa.restriction;
                        }
                        else {
                            const sinGluten = subscriptionsWithRestrictions.find(subscription => subscription?.restriction?.value === "GL");
                            if (sinGluten) {
                                orders = orders.filter(order => order.subscriptionId === sinGluten.id);
                                restriction = sinGluten.restriction;
                            }
                            else {
                                const sinLactosa = subscriptionsWithRestrictions.find(subscription => subscription?.restriction?.value === "LA");
                                if (sinLactosa) {
                                    orders = orders.filter(order => order.subscriptionId === sinLactosa.id);
                                    restriction = sinLactosa.restriction;
                                }
                                else {
                                    const aptoTodo = subscriptionsWithRestrictions.find(subscription => subscription?.restriction?.value === "" || subscription?.restriction?.value === "apto_todo");
                                    if (aptoTodo) {
                                        orders = orders.filter(order => order.subscriptionId === aptoTodo.id);
                                        restriction = aptoTodo.restriction;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // De todas las ordenes, me quedo con la que tenga la fecha de envio mas cercana a la actualidad
        const now = new Date();
        const order = orders.reduce((prev, curr) => {
            const prevDiff = Math.abs(now.getTime() - prev.shippingDate.getTime());
            const currDiff = Math.abs(now.getTime() - curr.shippingDate.getTime());
            return prevDiff < currDiff ? prev : curr;
        }, orders[0]);

        return { order, restriction };
    }


    /**
     * Getter recipeRatingRepository
     * @return {IRateRepository}
     */
    public get recipeRatingRepository(): IRateRepository {
        return this._recipeRatingRepository;
    }

    /**
     * Getter customerRepository
     * @return {ICustomerRepository}
     * */
    public get customerRepository(): ICustomerRepository {
        return this._customerRepository;
    }

    /**
     * Getter orderRepository
     * @return {IOrderRepository}
     */
    public get orderRepository(): IOrderRepository {
        return this._orderRepository;
    }


    /**
     * Getter subscriptionRepository
     * @return {ISubscriptionRepository}
     */
    public get subscriptionRepository(): ISubscriptionRepository {
        return this._subscriptionRepository;
    }


    /**
     * Getter exportService
     * @return {IExportService}
     */
    public get exportService(): IExportService {
        return this._exportService;
    }

}
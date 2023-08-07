import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { CreateSubscription } from "./createSubscription";
import { CreateSubscriptionDto } from "./createSubscriptionDto";
import { CreateSubscriptionPresenter } from "./createSubscriptionPresenter";

export class CreateSubscriptionController extends BaseController {
    private _createSubscription: CreateSubscription;
    private _createSubscriptionPresenter: CreateSubscriptionPresenter;

    constructor(createSubscription: CreateSubscription, createSubscriptionPresenter: CreateSubscriptionPresenter) {
        super();
        this._createSubscription = createSubscription;
        this._createSubscriptionPresenter = createSubscriptionPresenter;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: CreateSubscriptionDto = {
                customerId: this.req.body.customerId,
                planFrequency: this.req.body.planFrequency,
                planId: this.req.body.planId,
                planVariantId: this.req.body.planVariantId,
                restrictionComment: this.req.body.restrictionComment,
                couponId: this.req.body.couponId,
                stripePaymentMethodId: this.req.body.stripePaymentMethodId,
                paymentMethodId: this.req.body.paymentMethodId,
                addressDetails: this.req.body.addressDetails,
                addressName: this.req.body.addressName,
                customerFirstName: this.req.body.customerFirstName,
                customerLastName: this.req.body.customerLastName,
                latitude: this.req.body.latitude,
                longitude: this.req.body.longitude,
                phone1: this.req.body.phone1,
                locale: (<any>Locale)[this.req.query.locale as string] || Locale.es,
                shippingCity: this.req.body.shippingCity ?? "",
                shippingCountry: this.req.body.shippingCountry ?? "",
                shippingPostalCode: this.req.body.shippingPostalCode ?? "",
                shippingProvince: this.req.body.shippingProvince ?? "",
                purchaseDate: new Date(),
            };

            console.log("Dto: ", dto)
            const result = await this.createSubscription.execute(dto);
            const presented = this.createSubscriptionPresenter.present(
                result.subscription,
                result.paymentIntent,
                result.firstOrder,
                result.customerPaymentMethods,
                result.amountBilled,
                result.tax,
                result.shippingCost,
                result.billedPaymentOrderHumanId,
                dto.locale
            );

            return this.ok(this.res, presented);
        } catch (error: any) {
            return this.fail(error);
        }
    }

    /**
     * Getter createSubscription
     * @return {CreateSubscription}
     */
    public get createSubscription(): CreateSubscription {
        return this._createSubscription;
    }

    /**
     * Getter createSubscriptionPresenter
     * @return {CreateSubscriptionPresenter}
     */
    public get createSubscriptionPresenter(): CreateSubscriptionPresenter {
        return this._createSubscriptionPresenter;
    }
}

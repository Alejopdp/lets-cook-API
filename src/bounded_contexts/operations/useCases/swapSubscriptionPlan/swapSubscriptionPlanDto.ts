export interface SwapSubscriptionPlanDto {
    subscriptionId: string;
    newPlanId: string;
    newPlanVariantId: string;
    nameOrEmailOfAdminExecutingRequest: string | undefined;
    queryDate: Date;
}

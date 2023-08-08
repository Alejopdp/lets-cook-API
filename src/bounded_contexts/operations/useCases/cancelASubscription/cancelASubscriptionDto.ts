export interface CancelASubscriptionDto {
    subscriptionId: string;
    cancellationReason: string;
    cancellationComment: string;
    nameOrEmailOfAdminExecutingRequest?: string;
    queryDate: Date;
}

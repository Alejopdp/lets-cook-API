export interface SkipOrdersDto {
    ordersToSkip: string[];
    ordersToReactivate: string[];
    nameOrEmailOfAdminExecutingRequest: string | undefined;
}

export interface SkipOrdersDto {
    ordersIds: string[] | number[];
    ordersToSkip: string[];
    ordersToReactivate: string[];
    nameOrEmailOfAdminExecutingRequest: string | undefined;
}

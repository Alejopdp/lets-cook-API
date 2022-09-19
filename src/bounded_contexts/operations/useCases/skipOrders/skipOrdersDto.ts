import { Locale } from "../../domain/locale/Locale";

export interface SkipOrdersDto {
    ordersToSkip: string[];
    ordersToReactivate: string[];
    nameOrEmailOfAdminExecutingRequest: string | undefined;
    locale: Locale
}

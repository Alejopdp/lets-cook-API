import { UpdateSubscriptionRestrictionDto } from "./updateSubscriptionRestrictionDto";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { SubscriptionId } from "../../domain/subscription/SubscriptionId";
import { RecipeVariantRestriction } from "../../domain/recipe/RecipeVariant/recipeVariantResitriction/RecipeVariantRestriction";
import { RecipeRestrictionId } from "../../domain/recipe/RecipeVariant/recipeVariantResitriction/recipeRestrictionId";
import { IRecipeRestrictionRepository } from "../../infra/repositories/recipeVariantRestriction/IRecipeRestrictionRepository";
import { ILogRepository } from "../../infra/repositories/log/ILogRepository";
import { Subscription } from "../../domain/subscription/Subscription";
import { Log } from "../../domain/customer/log/Log";
import { LogType } from "../../domain/customer/log/LogType";
import { INotificationService } from "@src/shared/notificationService/INotificationService";
import { Locale } from "../../domain/locale/Locale";

export class UpdateSubscriptionRestriction {
    private _subscriptionRepository: ISubscriptionRepository;
    private _restrictionRepository: IRecipeRestrictionRepository;
    private _notificationService: INotificationService;
    private _logRepository: ILogRepository;

    constructor(
        subscriptionRepository: ISubscriptionRepository,
        restrictionRepository: IRecipeRestrictionRepository,
        notificationService: INotificationService,
        logRepository: ILogRepository
    ) {
        this._subscriptionRepository = subscriptionRepository;
        this._restrictionRepository = restrictionRepository;
        this._notificationService = notificationService;
        this._logRepository = logRepository;
    }

    public async execute(dto: UpdateSubscriptionRestrictionDto): Promise<void> {
        const subscriptionId: SubscriptionId = new SubscriptionId(dto.subscriptionId);
        const restrictionId: RecipeRestrictionId = new RecipeRestrictionId(dto.restrictionId);
        const subscription: Subscription = await this.subscriptionRepository.findByIdOrThrow(subscriptionId);
        const restriction: RecipeVariantRestriction = await this.restrictionRepository.findByIdOrThrow(restrictionId, dto.locale);

        // TO DO: QUe pasa si tiene recetas elegidas con otra restricción

        subscription.updateRestriction(restriction, dto.comment);

        await this.subscriptionRepository.save(subscription);
        this.notificationService.notifyAdminAboutRestrictionChange(subscription);
        const log: Log = new Log(
            LogType.RESTRICTION_UPDATED,
            dto.nameOrEmailOfAdminExecutingRequest || subscription.customer.getFullNameOrEmail(),
            !!dto.nameOrEmailOfAdminExecutingRequest ? "Admin" : "Usuario",
            `Restricción actualizada (${subscription.restriction?.label} para la suscripción de ${
                subscription.plan.name
            } con variante ${subscription.getPlanVariantLabel(Locale.es)})`,
            `Restricción actualizada (${subscription.restriction?.id.toString()} para la suscripción ${subscription.id.toString()}`,
            new Date(),
            subscription.customer.id
        );

        this.logRepository.save(log);
    }

    /**
     * Getter subscriptionRepository
     * @return {ISubscriptionRepository}
     */
    public get subscriptionRepository(): ISubscriptionRepository {
        return this._subscriptionRepository;
    }

    /**
     * Getter restrictionRepository
     * @return {IRecipeRestrictionRepository}
     */
    public get restrictionRepository(): IRecipeRestrictionRepository {
        return this._restrictionRepository;
    }

    /**
     * Getter notificationService
     * @return {INotificationService}
     */
    public get notificationService(): INotificationService {
        return this._notificationService;
    }

    /**
     * Getter logRepository
     * @return {ILogRepository}
     */
    public get logRepository(): ILogRepository {
        return this._logRepository;
    }
}

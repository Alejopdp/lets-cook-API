import { UpdateSubscriptionRestrictionDto } from "./updateSubscriptionRestrictionDto";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { SubscriptionId } from "../../domain/subscription/SubscriptionId";
import { RecipeVariantRestriction } from "../../domain/recipe/RecipeVariant/recipeVariantResitriction/RecipeVariantRestriction";
import { RecipeRestrictionId } from "../../domain/recipe/RecipeVariant/recipeVariantResitriction/recipeRestrictionId";
import { IRecipeRestrictionRepository } from "../../infra/repositories/recipeVariantRestriction/IRecipeRestrictionRepository";
import { Subscription } from "../../domain/subscription/Subscription";
import { INotificationService } from "@src/shared/notificationService/INotificationService";

export class UpdateSubscriptionRestriction {
    private _subscriptionRepository: ISubscriptionRepository;
    private _restrictionRepository: IRecipeRestrictionRepository;
    private _notificationService: INotificationService;

    constructor(
        subscriptionRepository: ISubscriptionRepository,
        restrictionRepository: IRecipeRestrictionRepository,
        notificationService: INotificationService
    ) {
        this._subscriptionRepository = subscriptionRepository;
        this._restrictionRepository = restrictionRepository;
        this._notificationService = notificationService;
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
}

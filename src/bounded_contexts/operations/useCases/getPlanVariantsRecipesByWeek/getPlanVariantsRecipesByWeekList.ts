import { Plan } from "../../domain/plan/Plan";
import { IPlanRepository } from "../../infra/repositories/plan/IPlanRepository";
import { GetGetPlanVariantsRecipesByWeekListDto } from "./getPlanVariantsRecipesByWeekListDto";
import { GetAdditionalPlanListPresenter } from "./getPlanVariantsRecipesByWeekListPresenter";
import { IWeekRepository } from "../../infra/repositories/week/IWeekRepository";
import { IRecipeRepository } from "../../infra/repositories/recipe/IRecipeRepository";
import { Week } from "../../domain/week/Week";
import { Recipe } from "../../domain/recipe/Recipe";
import { Locale } from "../../domain/locale/Locale";

export class GetPlanVariantsRecipesByWeekList {
    private _planRepository: IPlanRepository;
    private _weekRepository: IWeekRepository;
    private _recipeRepository: IRecipeRepository;

    constructor(planRepository: IPlanRepository, recipeRepository: IRecipeRepository, weekRepository: IWeekRepository,) {
        this._planRepository = planRepository;
        this._recipeRepository = recipeRepository;
        this._weekRepository = weekRepository;
    }

    public async execute(): Promise<any> {
        const weeks: Week[] = await this.weekRepository.findAll();
        const date_currently = new Date();
        let week_filtered = weeks.filter((val: Week) => val.minDay <= date_currently && date_currently <= val.maxDay);

        const recipes: Recipe[] = await this.recipeRepository.findByWeekId(week_filtered[0].id);

        const plans: Plan[] = await this.planRepository.findAll((<any>Locale)['es' as string] || Locale.es);

        let filterPlans: any[] = [];
        for(let i = 0; i < recipes.length; i++) {
            for(let j = 0; j < plans.length; j++) {
                for(let k = 0; k < recipes[i].relatedPlans.length; k++) {
                    if(recipes[i].relatedPlans[k].value === plans[j].id.value) {
                        if(filterPlans.length === 0) {
                            filterPlans = [...filterPlans, plans[j]]
                        } else {
                            let planRepeated = filterPlans.filter((val: Plan) => val.id.value === plans[j].id.value);
                            if(planRepeated.length === 0) {
                                filterPlans = [...filterPlans, plans[j]]
                            }
                        }
                    }
                }
            }
        }

        for(let j = 0; j < filterPlans.length; j++) {
            for(let i = 0; i < recipes.length; i++) {
                for(let k = 0; k < recipes[i].relatedPlans.length; k++) {
                    if(recipes[i].relatedPlans[k].value === filterPlans[j].id.value) {
                        filterPlans[j].recipes = filterPlans[j].recipes ? [...filterPlans[j].recipes, recipes[i]] : [recipes[i]];
                    }
                }
            }
        }
        // console.log("Filtered: ", filterPlans);
        let filterPlansActive = filterPlans.filter((val: any) => val.isActive);

        return GetAdditionalPlanListPresenter.present(filterPlansActive);
        // return "true"
    }

    /**
     * Getter planRepository
     * @return {IPlanRepository}
     */
    public get planRepository(): IPlanRepository {
        return this._planRepository;
    }

    /**
     * Getter recipeRepository
     * @return {IRecipeRepository}
     */
     public get recipeRepository(): IRecipeRepository {
        return this._recipeRepository;
    }

    /**
     * Getter weekRepository
     * @return {IWeekRepository}
     */
     public get weekRepository(): IWeekRepository {
        return this._weekRepository;
    }
}

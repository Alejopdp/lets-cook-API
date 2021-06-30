import { RecipeRatingId } from "../../domain/recipeRating/RecipeRatingId";
import { DeleteRecipeRatingDto } from "./deleteRecipeRatingDto";

export class DeleteRecipeRating {
    // private _repository1: IRepository1;
    // private  _repository2: Irepository2;

    // constructor(repository1: IRepository1, repository2: IRepository2) {
    // this._repository1 = repository1
    // this._repository2 = repository2;
    // }

    public async execute(dto: DeleteRecipeRatingDto): Promise<any> {
        const recipeRatingId: RecipeRatingId = new RecipeRatingId(dto.recipeRatingId);
        return;
    }
}

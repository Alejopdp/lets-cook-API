export interface ChooseRecipesForOrderDto {
    orderId: string;
    recipeSelection: { recipeId: string; quantity: number; recipeVariantId: string }[];
}

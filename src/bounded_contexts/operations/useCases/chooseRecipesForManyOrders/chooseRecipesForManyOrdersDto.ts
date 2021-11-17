export interface ChooseRecipesForManyOrdersDto {
    selection: {
        orderId: string;
        recipeSelection: { quantity: number; recipeVariantSku: string; customerEmail: string }[];
        isAdminChoosing: boolean;
    }[];
}

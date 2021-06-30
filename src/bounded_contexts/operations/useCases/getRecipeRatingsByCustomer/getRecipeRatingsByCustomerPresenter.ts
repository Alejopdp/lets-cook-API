import { v4 as uuid } from "uuid";

export class GetRecipeRatingsByCustomerPresenter {
    public present(): any {
        const recipesToRate = [
            {
                id: uuid(),
                rating: undefined,
                comment: "",
                recipeName: "Salmón con quinoa",
                recipeImageUrl: "",
                label: "Entregado 1 vez (última entrega el 1-7 mayo)",
            },
            {
                id: uuid(),
                rating: undefined,
                comment: "",
                recipeName: "Salmón con quinoa",
                recipeImageUrl: "",
                label: "Entregado 1 vez (última entrega el 1-7 mayo)",
            },

            {
                id: uuid(),
                rating: undefined,
                comment: "",
                recipeName: "Salmón con quinoa",
                recipeImageUrl: "",
                label: "Entregado 1 vez (última entrega el 1-7 mayo)",
            },

            {
                id: uuid(),
                rating: undefined,
                comment: "",
                recipeName: "Salmón con quinoa",
                recipeImageUrl: "",
                label: "Entregado 1 vez (última entrega el 1-7 mayo)",
            },

            {
                id: uuid(),
                rating: undefined,
                comment: "",
                recipeName: "Salmón con quinoa",
                recipeImageUrl: "",
                label: "Entregado 1 vez (última entrega el 1-7 mayo)",
            },

            {
                id: uuid(),
                rating: undefined,
                comment: "",
                recipeName: "Salmón con quinoa",
                recipeImageUrl: "",
                label: "Entregado 1 vez (última entrega el 1-7 mayo)",
            },

            {
                id: uuid(),
                rating: undefined,
                comment: "",
                recipeName: "Salmón con quinoa",
                recipeImageUrl: "",
                label: "Entregado 1 vez (última entrega el 1-7 mayo)",
            },

            {
                id: uuid(),
                rating: undefined,
                comment: "",
                recipeName: "Salmón con quinoa",
                recipeImageUrl: "",
                label: "Entregado 1 vez (última entrega el 1-7 mayo)",
            },
        ];

        const recipesWithRating = [
            {
                id: uuid(),
                rating: 5,
                comment: "",
                recipeName: "Salmón con quinoa",
                recipeImageUrl: "",
                label: "Entregado 1 vez (última entrega el 1-7 mayo)",
            },
            {
                id: uuid(),
                rating: 4,
                comment: "",
                recipeName: "Salmón con quinoa",
                recipeImageUrl: "",
                label: "Entregado 1 vez (última entrega el 1-7 mayo)",
            },
            {
                id: uuid(),
                rating: 5,
                comment: "",
                recipeName: "Salmón con quinoa",
                recipeImageUrl: "",
                label: "Entregado 1 vez (última entrega el 1-7 mayo)",
            },
            {
                id: uuid(),
                rating: 3,
                comment: "",
                recipeName: "Salmón con quinoa",
                recipeImageUrl: "",
                label: "Entregado 1 vez (última entrega el 1-7 mayo)",
            },
            {
                id: uuid(),
                rating: 1,
                comment: "",
                recipeName: "Salmón con quinoa",
                recipeImageUrl: "",
                label: "Entregado 1 vez (última entrega el 1-7 mayo)",
            },

            {
                id: uuid(),
                rating: 4,
                comment: "",
                recipeName: "Salmón con quinoa",
                recipeImageUrl: "",
                label: "Entregado 1 vez (última entrega el 1-7 mayo)",
            },

            {
                id: uuid(),
                rating: 5,
                comment: "",
                recipeName: "Salmón con quinoa",
                recipeImageUrl: "",
                label: "Entregado 1 vez (última entrega el 1-7 mayo)",
            },

            {
                id: uuid(),
                rating: 2,
                comment: "",
                recipeName: "Salmón con quinoa",
                recipeImageUrl: "",
                label: "Entregado 1 vez (última entrega el 1-7 mayo)",
            },
        ];

        return { recipesToRate, recipesWithRating };
    }
}

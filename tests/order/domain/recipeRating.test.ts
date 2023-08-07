import { Customer } from "../../../src/bounded_contexts/operations/domain/customer/Customer"
import { RecipeRating } from "../../../src/bounded_contexts/operations/domain/recipeRating/RecipeRating"
import { IRecipeRepository } from "../../../src/bounded_contexts/operations/infra/repositories/recipe/IRecipeRepository"
import { MockRecipeRepository } from "../../../src/bounded_contexts/operations/infra/repositories/recipe/mockRecipeRepository"
import { CUSTOMER_EMAIL } from "../../mocks/customer"
import { rissotoDeBoniato } from "../../mocks/recipe"

const mockRecipeRepository: IRecipeRepository = new MockRecipeRepository([rissotoDeBoniato])

describe("RecipeRating", () => {
    const customer: Customer = Customer.create(CUSTOMER_EMAIL, true, "", [], 0, new Date())
    describe("Is rateable?", () => {
        it("Should return false if the recipe has not been delivered yet (Does not have any shippingDate", () => {
            const recipeRating = new RecipeRating(rissotoDeBoniato, customer.id, 0, new Date(), new Date(), [])
            expect(recipeRating.isRateable(new Date())).toBe(false)
        })

        it("Should return false if the recipe has a shipping date but the date of shipping is less than the query date", () => {
            const recipeRating = new RecipeRating(rissotoDeBoniato, customer.id, 0, new Date(), new Date(), [], 0)
            expect(recipeRating.isRateable(new Date())).toBe(false)
        })

        it("Should return true if it is already rated", () => {
            const recipeRating = new RecipeRating(rissotoDeBoniato, customer.id, 0, new Date(), new Date(), [new Date("2023-08-02")], 3)
            expect(recipeRating.isRateable(new Date())).toBe(true)
        })

        it("Should return true if at least has one shippingDate and the date of shipping is greater or equal than the query date and if it is not rated yet", () => {
            const recipeRating = new RecipeRating(rissotoDeBoniato, customer.id, 0, new Date(), new Date(), [new Date("2023-08-02")])
            expect(recipeRating.isRateable(new Date())).toBe(true)
        })
    })
})
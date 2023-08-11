import { UpdateRate } from "../../../src/bounded_contexts/operations/useCases/updateRate/updateRate";
import { InMemoryRateRepository } from "../../../src/bounded_contexts/operations/infra/repositories/rate/inMemoryRateRepository";
import { MockStorageService } from "../../../src/bounded_contexts/operations/application/storageService/mockStorageService";
import { RecipeRating } from "../../../src/bounded_contexts/operations/domain/recipeRating/RecipeRating";
import { arepasDeCrhistian } from "../../mocks/recipe";
import { Customer } from "../../../src/bounded_contexts/operations/domain/customer/Customer";
import { Locale } from "../../../src/bounded_contexts/operations/domain/locale/Locale";

const mockRecipeRatingRepository = new InMemoryRateRepository([])
const mockStorageService = new MockStorageService()
const updateRateUseCase = new UpdateRate(mockRecipeRatingRepository, mockStorageService)

describe("Given an unrated recipe", () => {
    let recipeRating: RecipeRating
    let customer: Customer
    let firstRatingDate: Date = new Date(2023, 7, 16, 13)

    beforeAll(() => {
        customer = Customer.create("alejoscotti@gmail.com", false, "", [], 0, new Date())
        recipeRating = new RecipeRating(arepasDeCrhistian, customer.id, 0, new Date(), new Date(), [new Date("2023-08-08"), new Date("2023-08-14")], false)
        mockRecipeRatingRepository.save(recipeRating)
    })

    describe("When the customer rates the recipe", () => {
        let testRecipeRating: RecipeRating

        beforeAll(async () => {
            await updateRateUseCase.execute({ commentRate: "Muy Rica!", rateId: recipeRating.id.toString(), rateValue: 5, ratingDate: firstRatingDate })
            testRecipeRating = (await mockRecipeRatingRepository.findById(recipeRating.id, Locale.es))!
        })

        it("Should save the rating value", () => {
            expect(testRecipeRating.rating).toBe(5)
        })

        it("Should save the comment", () => {
            expect(testRecipeRating.comment).toBe("Muy Rica!")
        })

        it("Should save the rating date", () => {
            expect(testRecipeRating.ratingDate?.getFullYear()).toEqual(firstRatingDate.getFullYear())
            expect(testRecipeRating.ratingDate?.getMonth()).toEqual(firstRatingDate.getMonth())
            expect(testRecipeRating.ratingDate?.getDate()).toEqual(firstRatingDate.getDate())
        })
    })

    describe("When the customer rates the recipe again", () => {
        let secondRatingDate: Date = new Date(2023, 7, 17, 13)
        let testRecipeRating: RecipeRating

        beforeAll(async () => {
            await updateRateUseCase.execute({ commentRate: "Puaj!", rateId: recipeRating.id.toString(), rateValue: 3, ratingDate: secondRatingDate })
            testRecipeRating = (await mockRecipeRatingRepository.findById(recipeRating.id, Locale.es))!
        })

        it("Should save the rating value", () => {
            expect(testRecipeRating.rating).toBe(3)
        })

        it("Should save the comment", () => {
            expect(testRecipeRating.comment).toBe("Puaj!")
        })

        it("Should not change the rating date", () => {
            expect(testRecipeRating.ratingDate?.getFullYear()).toEqual(firstRatingDate.getFullYear())
            expect(testRecipeRating.ratingDate?.getMonth()).toEqual(firstRatingDate.getMonth())
            expect(testRecipeRating.ratingDate?.getDate()).toEqual(firstRatingDate.getDate())
        })
    })

})
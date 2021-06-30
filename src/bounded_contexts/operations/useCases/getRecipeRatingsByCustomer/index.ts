import { GetRecipeRatingsByCustomer } from "./getRecipeRatingsByCustomer";
import { GetRecipeRatingsByCustomerController } from "./getRecipeRatingsByCustomerController";
import { GetRecipeRatingsByCustomerPresenter } from "./getRecipeRatingsByCustomerPresenter";

export const getRecipeRatingsByCustomer: GetRecipeRatingsByCustomer = new GetRecipeRatingsByCustomer();
export const getRecipeRatingsByCustomerPresenter: GetRecipeRatingsByCustomerPresenter = new GetRecipeRatingsByCustomerPresenter();
export const getRecipeRatingsByCustomerController: GetRecipeRatingsByCustomerController = new GetRecipeRatingsByCustomerController(
    getRecipeRatingsByCustomer,
    getRecipeRatingsByCustomerPresenter
);

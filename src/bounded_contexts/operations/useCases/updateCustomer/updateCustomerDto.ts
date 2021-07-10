import { ReadStream } from "fs";
import { Month } from "../../domain/recipe/Months";
import { RecipeDifficultyLevel } from "../../domain/recipe/RecipeGeneralData/RecipeDifficultyLevel";
import { PaymentMethod } from "../../domain/customer/paymentMethod/PaymentMethod";
import { Address } from "../../domain/address/Address";

export interface UpdateCustomerDto {
    customerId: string;
    email: string;
    isEmailVerified: boolean;
    stripeId: string;
    password: string;
    state: string;
    billingAddress: Address;
    shippingAddress: Address;
    paymentMethods: PaymentMethod[];
}

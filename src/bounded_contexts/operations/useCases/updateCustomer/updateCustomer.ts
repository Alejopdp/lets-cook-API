import { IStorageService } from "../../application/storageService/IStorageService";
import { CustomerId } from "../../domain/customer/CustomerId";
import { Customer } from "../../domain/customer/Customer";
import { Address } from "../../domain/address/Address";
import { UserPassword } from "../../../IAM/domain/user/UserPassword";
import { RecipeGeneralData } from "../../domain/recipe/RecipeGeneralData/RecipeGeneralData";
import { RecipeSku } from "../../domain/recipe/RecipeGeneralData/RecipeSku";
import { RecipeWeight } from "../../domain/recipe/RecipeGeneralData/RecipeWeight";
import { WeightUnit } from "../../domain/recipe/RecipeGeneralData/WeightUnit";
import { RecipeId } from "../../domain/recipe/RecipeId";
import { RecipeNutritionalData } from "../../domain/recipe/RecipeNutritionalData/RecipeNutritionalData";
import { RecipeTag } from "../../domain/recipe/RecipeTag";
import { RecipeVariant } from "../../domain/recipe/RecipeVariant/RecipeVariant";
import { Week } from "../../domain/week/Week";
import { WeekId } from "../../domain/week/WeekId";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { IWeekRepository } from "../../infra/repositories/week/IWeekRepository";
import { RecipeVariantCreator } from "../../services/recipeVariantCreator/recipeVariantCreator";
import { RecipeVariantCreatorDto } from "../../services/recipeVariantCreator/recipeVariantCreatorDto";
import { UpdateCustomerDto } from "./updateCustomerDto";

export class UpdateCustomer {
    private _customerRepository: ICustomerRepository;
    private _storageService: IStorageService;

    constructor(customerRepository: ICustomerRepository, storageService: IStorageService) {
        this._customerRepository = customerRepository;
        this._storageService = storageService;
    }

    public async execute(dto: UpdateCustomerDto): Promise<void> {
        const customerId: CustomerId = new CustomerId(dto.customerId);
        const customer: Customer | undefined = await this.customerRepository.findById(customerId);

        if (!customer) throw new Error("Error al buscar el cliente");
        // const variants: RecipeVariant[] = await this.recipeVariantCreator.execute(variantCreatorDto);
        // //@ts-ignore
        // const weeksIds: WeekId[] = dto.availableWeeksIds.map((weekId) => new WeekId(weekId));
        // const weeks: Week[] = await this.weekRepository.findAllById(weeksIds);

        const billingAddress: Address = new Address(
            dto.billingAddress.latitude,
            dto.billingAddress.longitude,
            dto.billingAddress.name,
            dto.billingAddress.fullName,
            dto.billingAddress.details,
            dto.billingAddress.id
        );

        const shippingAddress: Address = new Address(
            dto.shippingAddress.latitude,
            dto.shippingAddress.longitude,
            dto.shippingAddress.name,
            dto.shippingAddress.fullName,
            dto.shippingAddress.details,
            dto.shippingAddress.id
        );
        const password: UserPassword = UserPassword.create(dto.password, false).hashPassword();

        customer.email = dto.email;
        customer.isEmailVerified = dto.isEmailVerified;
        customer.stripeId = dto.stripeId;
        //@ts-ignore
        customer.shippingAddress = shippingAddress;
        customer.billingAddress = billingAddress;
        customer?.changePassword(password);
        customer.state = dto.state;
        customer.codeToRecoverPassword = undefined;
        customer.paymentMethods = dto.paymentMethods;
    }

    /**
     * Getter customerRepository
     * @return {ICustomerRepository}
     */
    public get customerRepository(): ICustomerRepository {
        return this._customerRepository;
    }

    /**
     * Getter storageService
     * @return {IStorageService}
     */
    public get storageService(): IStorageService {
        return this._storageService;
    }
}

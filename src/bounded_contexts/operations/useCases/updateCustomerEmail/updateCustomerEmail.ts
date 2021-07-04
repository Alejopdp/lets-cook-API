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
import { UpdateCustomerEmailDto } from "./updateCustomerEmailDto";

export class UpdateCustomerEmail {
    private _customerRepository: ICustomerRepository;
    private _storageService: IStorageService;

    constructor(
        customerRepository: ICustomerRepository,
        storageService: IStorageService,
    ) {
        this._customerRepository = customerRepository;
        this._storageService = storageService;
    }

    public async execute(dto: UpdateCustomerEmailDto): Promise<void> {
        const customerId: CustomerId = new CustomerId(dto.customerId);
        const customer: Customer | undefined = await this.customerRepository.findById(customerId);
        console.log(customer)
        if (!customer) throw new Error("Error al buscar el cliente");
        
        customer.email = dto.email;

        await this.customerRepository.save(customer);
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

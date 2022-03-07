import { CustomerId } from "../../domain/customer/CustomerId";
import { Customer } from "../../domain/customer/Customer";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { UpdateCustomerEmailDto } from "./updateCustomerEmailDto";
import { ITokenService } from "../../../IAM/application/tokenService/ITokenService";

// Se marca al usuario como correo no verificado?
// Se envia un correo al email con un link para que el usuario cambie el email
// El usuario entra al link y se hace la actualización
// Se desloguea al usuario para que iingrese con el nuevo email

export class UpdateCustomerEmail {
    private _customerRepository: ICustomerRepository;
    private _tokenService: ITokenService;

    constructor(customerRepository: ICustomerRepository, tokenService: ITokenService) {
        this._customerRepository = customerRepository;
        this._tokenService = tokenService;
    }

    public async execute(dto: UpdateCustomerEmailDto): Promise<{ email: string }> {
        const payload = await this.tokenService.isUpdateEmailVerified(dto.token);
        if (payload.expiredToken) throw new Error("El link ha vencido.");

        const customerId: CustomerId = new CustomerId(payload.customerId);
        const customer: Customer | undefined = await this.customerRepository.findById(customerId);
        if (!customer) throw new Error("Error al buscar el cliente");

        customer.email = payload.email;

        await this.customerRepository.save(customer);

        return { email: customer.email };
    }

    /**
     * Getter customerRepository
     * @return {ICustomerRepository}
     */
    public get customerRepository(): ICustomerRepository {
        return this._customerRepository;
    }

    /**
     * Getter tokenService
     * @return {ITokenService}
     */
    public get tokenService(): ITokenService {
        return this._tokenService;
    }
}

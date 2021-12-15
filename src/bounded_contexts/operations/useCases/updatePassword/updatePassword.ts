import { logger } from "../../../../../config";
import { IStorageService } from "../../application/storageService/IStorageService";
import { Locale } from "../../domain/locale/Locale";
import { Customer } from "../../domain/customer/Customer";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { UpdatePasswordDto } from "./updatePasswordDto";
import { shippingRouter } from "../../infra/http/shipping";
import { UserPassword } from "../../../IAM/domain/user/UserPassword";
import { ILogRepository } from "../../infra/repositories/log/ILogRepository";
import { Log } from "../../domain/customer/log/Log";
import { LogType } from "../../domain/customer/log/LogType";

export class UpdatePassword {
    private _updatePasswordRepository: ICustomerRepository;
    private _storageService: IStorageService;
    private _logRepository: ILogRepository;

    constructor(updatePasswordRepository: ICustomerRepository, storageService: IStorageService, logRepository: ILogRepository) {
        this._updatePasswordRepository = updatePasswordRepository;
        this._storageService = storageService;
        this._logRepository = logRepository;
    }

    public async execute(dto: UpdatePasswordDto): Promise<void> {
        const customer: Customer | undefined = await this.updatePasswordRepository.findByEmail(dto.email);
        if (!!!customer) throw new Error("User not found.");
        if (dto.code !== customer.codeToRecoverPassword) throw new Error("El código para recuperar la contraseña no es correcto");

        const newPassword: UserPassword = UserPassword.create(dto.newPassword, false).hashPassword();

        customer?.changePassword(newPassword);

        await this.updatePasswordRepository.save(customer);
        this.logRepository.save(
            new Log(
                LogType.PASSWORD_UPDATED,
                customer.getFullNameOrEmail(),
                "Usuario",
                `El usuarió cambió la contraseña`,
                `El usuarió cambió la contraseña`,
                new Date(),
                customer.id
            )
        );
    }

    /**
     * Getter customerRepository
     * @return {ICustomerRepository}
     */
    public get updatePasswordRepository(): ICustomerRepository {
        return this._updatePasswordRepository;
    }

    /**
     * Getter storageService
     * @return {IStorageService}
     */
    public get storageService(): IStorageService {
        return this._storageService;
    }

    /**
     * Getter logRepository
     * @return {ILogRepository}
     */
    public get logRepository(): ILogRepository {
        return this._logRepository;
    }
}

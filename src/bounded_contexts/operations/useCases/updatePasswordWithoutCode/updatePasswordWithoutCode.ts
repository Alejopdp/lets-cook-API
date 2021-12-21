import { Customer } from "../../domain/customer/Customer";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { UpdatePasswordWithoutCodeDto } from "./updatePasswordWithoutCodeDto";
import { UserPassword } from "../../../IAM/domain/user/UserPassword";
import { ILogRepository } from "../../infra/repositories/log/ILogRepository";
import { Log } from "../../domain/customer/log/Log";
import { LogType } from "../../domain/customer/log/LogType";

export class UpdatePasswordWithoutCode {
    private _updatePasswordRepository: ICustomerRepository;
    private _logRepository: ILogRepository;

    constructor(updatePasswordRepository: ICustomerRepository, logRepository: ILogRepository) {
        this._updatePasswordRepository = updatePasswordRepository;
        this._logRepository = logRepository;
    }

    public async execute(dto: UpdatePasswordWithoutCodeDto): Promise<void> {
        const customer: Customer | undefined = await this.updatePasswordRepository.findByEmail(dto.email);
        if (!!!customer) throw new Error("User not found.");
        if (customer.email !== dto.emailOfRequester) throw new Error("No puedes cambiar la contraseña de otro usuario");

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
     * Getter logRepository
     * @return {ILogRepository}
     */
    public get logRepository(): ILogRepository {
        return this._logRepository;
    }
}

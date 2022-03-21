import { UseCase } from "../../../../core/domain/UseCase";
import { Either, Failure, isFailure, isSuccess } from "../../../../core/logic/Result";
import { INotificationService } from "../../../../shared/notificationService/INotificationService";
import { ITokenService } from "../../../IAM/application/tokenService/ITokenService";
import { Customer } from "../../domain/customer/Customer";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { ForgotPasswordDto } from "./forgotPasswordDto";
const crypto = require("crypto");
import { ForgotPasswordErrors, invalidArguments } from "./forgotPasswordErrors";

type Response = Either<Failure<ForgotPasswordErrors>, any>;

export class ForgotPassword implements UseCase<ForgotPasswordDto, Promise<Response>> {
    private _userRepository: ICustomerRepository;
    private _notificationService: INotificationService;
    private _tokenService: ITokenService;

    constructor(userRepository: ICustomerRepository, notificationService: INotificationService, tokenService: ITokenService) {
        this._userRepository = userRepository;
        this._notificationService = notificationService;
        this._tokenService = tokenService;
    }

    public async execute(dto: ForgotPasswordDto): Promise<Response> {
        const customer: Customer | undefined = await this.customerRepository.findByEmail(dto.email);
        if (!customer) throw new Error(`No existe ningún cliente con el email ${dto.email}`);

        const token = this.tokenService.passwordGenerationToken({ email: customer.email, id: customer.id.value });
        let random: string = parseInt(crypto.randomBytes(3).toString("hex"), 16).toString().substr(0, 6);

        customer.codeToRecoverPassword = random;

        await this.notificationService.notifyNewBackOfficeUserToRecoverPassword(customer.email, random);

        await this.customerRepository.save(customer);

        return isSuccess(undefined);
    }

    /**
     * Getter customerRepository
     * @return {ICustomerRepository}
     */
    public get customerRepository(): ICustomerRepository {
        return this._userRepository;
    }

    /**
     * Getter notificationService
     * @return {INotificationService}
     */
    public get notificationService(): INotificationService {
        return this._notificationService;
    }

    /**
     * Getter tokenService
     * @return {ITokenService}
     */
    public get tokenService(): ITokenService {
        return this._tokenService;
    }
}

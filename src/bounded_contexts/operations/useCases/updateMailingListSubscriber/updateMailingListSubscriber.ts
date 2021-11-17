import { IMailingListService } from "../../application/mailingListService/IMailingListService";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { UpdateMailingListSubscriberDto } from "./updateMailingListSubscriberDto";

export class UpdateMailingListSubscriber {
    private _customerRepository: ICustomerRepository;
    private _mailingListService: IMailingListService;

    constructor(customerRepository: ICustomerRepository, mailingListService: IMailingListService) {
        this._customerRepository = customerRepository;
        this._mailingListService = mailingListService;
    }

    public async execute(dto: UpdateMailingListSubscriberDto): Promise<any> {
        await this.mailingListService.updateSubscriber(dto.email, dto.data);
    }

    /**
     * Getter customerRepository
     * @return {ICustomerRepository}
     */
    public get customerRepository(): ICustomerRepository {
        return this._customerRepository;
    }

    /**
     * Getter mailingListService
     * @return {IMailingListService}
     */
    public get mailingListService(): IMailingListService {
        return this._mailingListService;
    }
}

import schedule from "node-schedule";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { ChargeMoneyToWallet } from "../chargeMoneyToWallet/chargeMoneyToWallet";
import { Day } from "../../domain/day/Day";
import { ChargeWalletJobDto } from "./cargeWalletJobDto";

export class ChargeWalletJob {

    private _customerRepository: ICustomerRepository;
    private _chargeMoneyToWallet: ChargeMoneyToWallet;

    constructor(customerRepository: ICustomerRepository, chargeMoneyToWallet: ChargeMoneyToWallet) {
        this._customerRepository = customerRepository;
        this._chargeMoneyToWallet = chargeMoneyToWallet;
    }

    public async execute(dto: ChargeWalletJobDto): Promise<schedule.Job[]> {
        console.log("*********************************** STARTING WALLET JOB ***********************************")
        const customers = await this.customerRepository.findAllWithWalletEnabled();
        const jobs = [];

        for (const customer of customers) {
            for (const dateOfCharge of customer.wallet?.datesOfCharge ?? []) {
                const today: Date = dto.executionDate ?? new Date()

                if (dateOfCharge.matches(new Day(today.getDay()))) {
                    const jobDate: Date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(dateOfCharge.hour), parseInt(dateOfCharge.minute))
                    jobDate.toLocaleString("es-ES", { timeZone: "Europe/Madrid" })

                    const job = schedule.scheduleJob(jobDate, async () => {
                        await this.chargeMoneyToWallet.execute({ customer, amountToCharge: customer.wallet?.amountToCharge ?? 0 });
                        await this.customerRepository.save(customer);
                    });


                    jobs.push(job);
                }
            }
        }

        console.log("*********************************** ENDING WALLET JOB ***********************************")

        return jobs
    }

    /**
     * Getter customerRepository
     * @return {ICustomerRepository}
     */
    public get customerRepository(): ICustomerRepository {
        return this._customerRepository;
    }

    /**
     * Getter chargeMoneyToWallet
     * @return {ChargeMoneyToWallet}
     */
    public get chargeMoneyToWallet(): ChargeMoneyToWallet {
        return this._chargeMoneyToWallet;
    }
}
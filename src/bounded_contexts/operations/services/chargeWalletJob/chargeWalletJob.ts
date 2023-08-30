import { scheduleJob, scheduledJobs, Job } from "node-schedule";
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

    public async execute(dto: ChargeWalletJobDto): Promise<Job[] | undefined> {
        try {

            const customers = await this.customerRepository.findAllWithWalletEnabled();
            const newJobs = [];
            const remainingJobs = []

            for (const customer of customers) {
                for (const dateOfCharge of customer.wallet?.datesOfCharge ?? []) {
                    const today: Date = dto.executionDate ?? new Date()

                    if (dateOfCharge.day.dayNumberOfWeek === today.getDay() && (parseInt(dateOfCharge.hour) > today.getHours() || (parseInt(dateOfCharge.hour) === today.getHours() && parseInt(dateOfCharge.minute) > today.getMinutes()))) {

                        const jobId = `${customer.id.value}-${today.getDay()}`
                        if (scheduledJobs[jobId]) {
                            remainingJobs.push(scheduledJobs[jobId])
                            continue
                        }

                        const job = scheduleJob(jobId, `${dateOfCharge.minute} ${dateOfCharge.hour} * * ${dateOfCharge.day.dayNumberOfWeek}`, async () => {
                            await this.chargeMoneyToWallet.execute({ customer, amountToCharge: customer.wallet?.amountToCharge ?? 0 });
                            await this.customerRepository.save(customer);
                        });

                        newJobs.push(job);
                    }
                }
            }

            // Cancel the scheduledJobs that doesn't match with the newJobs and the remainingJobs
            for (const scheduledJobId in scheduledJobs) {
                if (scheduledJobId === "schedule_wallets_job" || scheduledJobId === "billing_job") continue
                if (!newJobs.find(job => job.name === scheduledJobId) && !remainingJobs.find(job => job.name === scheduledJobId)) {
                    console.log("Scheduled Job Id to delete: ", scheduledJobId)
                    scheduledJobs[scheduledJobId].cancel()
                }
            }

            return newJobs
        } catch (error) {
            console.log("Error: ", error)
        }

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
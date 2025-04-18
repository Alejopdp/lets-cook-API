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
            const alreadyScheduledJobs = []

            for (const customer of customers) {
                for (const dateOfCharge of customer.wallet?.datesOfCharge ?? []) {
                    const today: Date = dto.executionDate ?? new Date()
                    const dateOfChargeIsToday = dateOfCharge.day.dayNumberOfWeek === today.getDay()
                    const hourOfChargeIsGreaterThanNow = parseInt(dateOfCharge.hour) > today.getHours()
                    const hourAndMinutesOfChargeIsGreaterThanNow = (parseInt(dateOfCharge.hour) === today.getHours() && parseInt(dateOfCharge.minute) > today.getMinutes())

                    if (dateOfChargeIsToday && (hourOfChargeIsGreaterThanNow || hourAndMinutesOfChargeIsGreaterThanNow)) {

                        const jobId = `${customer.id.toString()}-${today.getDay()}-${dateOfCharge.hour}-${dateOfCharge.minute}`
                        const isAJobScheduledWithTheSameId = scheduledJobs[jobId]

                        if (isAJobScheduledWithTheSameId) {
                            alreadyScheduledJobs.push(scheduledJobs[jobId])
                            continue
                        }

                        const job = scheduleJob(jobId, `${dateOfCharge.minute} ${dateOfCharge.hour} * * ${dateOfCharge.day.dayNumberOfWeek}`, async () => {
                            let customerToCharge = await this.customerRepository.findByIdOrThrow(customer.id)
                            await this.chargeMoneyToWallet.execute({ customer: customerToCharge, amountToCharge: customerToCharge.wallet?.amountToCharge ?? 0 });
                            await this.customerRepository.save(customerToCharge);
                        });

                        newJobs.push(job);
                    }
                }
            }

            // Cancel the scheduledJobs that doesn't match with the newJobs and the remainingJobs
            for (const scheduledJobId in scheduledJobs) {
                const isNotAChargeWalletJob = scheduledJobId === "schedule_wallets_job" || scheduledJobId === "billing_job"

                if (isNotAChargeWalletJob) continue

                const isANewJob = newJobs.find(job => job.name === scheduledJobId)
                const isAnAlreadyScheduledJob = alreadyScheduledJobs.find(job => job.name === scheduledJobId)

                if (!isANewJob && !isAnAlreadyScheduledJob) {
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
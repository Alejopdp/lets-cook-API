import { Rate } from "../../../domain/rate/Rate";
import { RateId } from "../../../domain/rate/RateId";
import { IRateRepository } from "./IRateRepository";
import { Rate as MongooseRate } from "../../../../../infraestructure/mongoose/models";
import { rateMapper } from "../../../mappers";

export class MongooseRateRepository implements IRateRepository {
    public async save(rate: Rate): Promise<void> {
        const rateDb = rateMapper.toPersistence(rate);
        // console.log("Test: ", couponDb)
        if (await MongooseRate.exists({ _id: rate.id.value })) {
            console.log("Test: ", rate.id.value, rateDb.state);
            await MongooseRate.updateOne(
                { _id: rate.id.value },
                {
                    $set: {
                        customerId: rateDb.customerId,
                        recipeId: rateDb.recipeId,
                        rateValue: rateDb.rateValue,
                        comment: rateDb.comment,
                    },
                }
            );
        } else {
            await MongooseRate.create(rateDb);
        }
    }

    public async findById(rateId: RateId): Promise<Rate | undefined> {
        const rateDb = await MongooseRate.findById(rateId.value, { deletionFlag: false });

        return rateDb ? rateMapper.toDomain(rateDb) : undefined;
    }

    public async findAll(): Promise<Rate[]> {
        return await this.findBy({});
    }

    public async findBy(conditions: any): Promise<Rate[]> {
        const rateDb = await MongooseRate.find({ ...conditions, deletionFlag: false });
        return rateDb.map((raw: any) => rateMapper.toDomain(raw));
    }

    public async delete(rateId: RateId): Promise<void> {
        await MongooseRate.updateOne({ _id: rateId.value }, { $set: { deletionFlag: true } });
    }
}

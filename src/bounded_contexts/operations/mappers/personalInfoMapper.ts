import { Mapper } from "../../../core/infra/Mapper";
import { PersonalInfo } from "../domain/customer/personalInfo/PersonalInfo";
import { PersonalInfoId } from "../domain/customer/personalInfo/PersonalInfoId";

export class PersonalInfoMapper implements Mapper<PersonalInfo, any> {
    public toDomain(raw: any): PersonalInfo {
        return new PersonalInfo(
            raw.name,
            raw.lastName,
            raw.phone1,
            raw.phone2,
            raw.birthDate ? new Date(raw.birthDate) : undefined,
            raw.preferredLanguage,
            new PersonalInfoId(raw._id)
        );
    }
    public toPersistence(t: PersonalInfo): any {
        return {
            name: t.name,
            lastName: t.lastName,
            phone1: t.phone1,
            phone2: t.phone2,
            birthDate: t.birthDate,
            preferredLanguage: t.preferredLanguage,
            _id: t.id.value,
        };
    }
}

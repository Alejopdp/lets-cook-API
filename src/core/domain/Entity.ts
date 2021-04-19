import { UniqueEntityID } from "./UniqueEntityID";

const isEntity = (v: any): v is Entity<any> => {
    return v instanceof Entity;
};

export abstract class Entity<T> {
    protected readonly _id: UniqueEntityID;

    constructor(id?: UniqueEntityID) {
        this._id = id ? id : new UniqueEntityID();
    }

    public equals(object?: Entity<T>): boolean {
        if (object == null || object == undefined) {
            return false;
        }

        if (this === object) {
            return true;
        }

        if (!isEntity(object)) {
            return false;
        }

        return this._id.equals(object._id);
    }

    /**
     * Getter resetPasswordExpires
     * @return {UniqueEntityID}
     */
    public get id(): UniqueEntityID {
        return this._id;
    }
}

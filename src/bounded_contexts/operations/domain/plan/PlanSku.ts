import { IValueObject } from "../../../../core/domain/ValueObject";
import { Guard } from "../../../../core/logic/Guard";

export class PlanSku implements IValueObject<PlanSku> {
    // TO DO: Nos tienen que pasar la estructura del SKU
    private _code: string;

    constructor(code: string) {
        const guardResult = Guard.againstNullOrUndefinedOrEmpty(code, "SKU");

        if (!guardResult.succeeded) throw new Error(guardResult.message);
        this._code = code;
    }

    public equals(aPlanSku: PlanSku): boolean {
        return this.code === aPlanSku.code;
    }

    /**
     * Getter code
     * @return {string}
     */
    public get code(): string {
        return this._code;
    }

    /**
     * Setter code
     * @param {string} value
     */
    public set code(value: string) {
        this._code = value;
    }
}

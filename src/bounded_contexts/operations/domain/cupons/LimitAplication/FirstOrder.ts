import { ILimitAplication } from "./ILimitAplication";

export class FirstOrder implements ILimitAplication{
    public type: string;
    public value: number;

    constructor(type: string, value: number) {
        this.type = type;
        this.value = value;
    }
    
    isValid(appliedQty: number): boolean {
        throw new Error("Method not implemented.");
    }
}
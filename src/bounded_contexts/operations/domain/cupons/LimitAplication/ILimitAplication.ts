export interface ILimitAplication {
    type: string,
    value: number,
    isValid(appliedQty: number) : boolean;
}

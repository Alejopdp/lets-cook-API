import { Failure } from "../../../../core/logic/Result";

export enum GetUserByIdErrors {
    InvalidArguments,
}

export const invalidArguments = (): Failure<GetUserByIdErrors.InvalidArguments> => {
    return {
        type: GetUserByIdErrors.InvalidArguments,
        reason: "El usuario indicado no existe",
    };
};

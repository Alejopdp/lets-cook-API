import { Failure } from "../../../../core/logic/Result";

export enum UpdateUserErrors {
    InvalidUser,
    InvalidArguments,
}

export const invalidUser = (): Failure<UpdateUserErrors.InvalidUser> => {
    return {
        type: UpdateUserErrors.InvalidUser,
        reason: "El usuario indicado no existe",
    };
};

export const invalidArguments = (): Failure<UpdateUserErrors.InvalidArguments> => {
    return {
        type: UpdateUserErrors.InvalidArguments,
        reason: "El rol indicado no existe",
    };
};

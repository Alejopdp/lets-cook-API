import { Failure } from "../../../../core/logic/Result";

export enum ForgotPasswordErrors {
    InvalidArguments,
}

export const invalidArguments = (): Failure<ForgotPasswordErrors.InvalidArguments> => {
    return {
        type: ForgotPasswordErrors.InvalidArguments,
        reason: "El usuario indicado no existe",
    };
};

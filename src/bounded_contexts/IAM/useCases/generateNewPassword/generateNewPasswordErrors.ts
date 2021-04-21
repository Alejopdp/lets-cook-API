import { Failure } from "../../../../core/logic/Result";

export enum GenerateNewPasswordErrors {
    InvalidArguments,
}

export const invalidArguments = (): Failure<GenerateNewPasswordErrors.InvalidArguments> => {
    return {
        type: GenerateNewPasswordErrors.InvalidArguments,
        reason: "No se encontró ningún usuario con el email ingresado",
    };
};

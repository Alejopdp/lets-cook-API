import { Failure } from "../../../../core/logic/Result";

export enum LoginWithEmailErrors {
    InvalidArguments,
    InactiveUser,
}

export const invalidLoginArguments = (): Failure<LoginWithEmailErrors.InvalidArguments> => {
    return {
        type: LoginWithEmailErrors.InvalidArguments,
        reason: "El correo electrónico o la contraseña ingresada es incorrecta",
    };
};

export const inactiveUser = (): Failure<LoginWithEmailErrors.InactiveUser> => {
    return {
        type: LoginWithEmailErrors.InactiveUser,
        reason: "El usuario ingresado no está activado",
    };
};

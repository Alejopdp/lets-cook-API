import { Locale } from "@src/bounded_contexts/operations/domain/locale/Locale";

export interface IGuardResult {
    succeeded: boolean;
    message?: string;
}

export interface IGuardArgument {
    argument: any;
    argumentName: string;
}

export type GuardArgumentCollection = IGuardArgument[];

export class Guard {
    public static combine(guardResults: IGuardResult[]): IGuardResult {
        for (let result of guardResults) {
            if (result.succeeded === false) return result;
        }

        return { succeeded: true };
    }

    public static againstAccents(text: string, locale: Locale): void {
        var accentArray = ["á", "à", "ã", "â", "é", "è", "ê", "í", "ì", "î", "õ", "ó", "ò", "ô", "ú", "ù", "û"];

        for (var i = 0; i < text.length; i++) {
            for (var j = 0; j < accentArray.length; j++) {
                if (text[i] === accentArray[j]) {
                    throw new Error(`The email must not have any special character`);
                }
            }
        }
    }

    public static againstNullOrUndefined(argument: any, argumentName: string): IGuardResult {
        if (argument === null || argument === undefined) {
            return { succeeded: false, message: `${argumentName} is null or undefined` };
        } else {
            return { succeeded: true };
        }
    }

    public static againstNullOrUndefinedOrEmpty(argument: any, argumentName: string): IGuardResult {
        if (argument === null || argument === undefined || argument === "") {
            return { succeeded: false, message: `${argumentName} is null or undefined or empty` };
        } else {
            return { succeeded: true };
        }
    }

    public static againstNullOrUndefinedBulk(args: GuardArgumentCollection): IGuardResult {
        for (let arg of args) {
            const result = this.againstNullOrUndefined(arg.argument, arg.argumentName);
            if (!result.succeeded) return result;
        }

        return { succeeded: true };
    }

    public static againstNullOrUndefinedOrEmptyBulk(args: GuardArgumentCollection): IGuardResult {
        for (let arg of args) {
            const result = this.againstNullOrUndefinedOrEmpty(arg.argument, arg.argumentName);
            if (!result.succeeded) return result;
        }

        return { succeeded: true };
    }

    public static isOneOf(value: any, validValues: any[], argumentName: string): IGuardResult {
        let isValid = false;
        for (let validValue of validValues) {
            if (value === validValue) {
                isValid = true;
            }
        }

        if (isValid) {
            return { succeeded: true };
        } else {
            return {
                succeeded: false,
                message: `${argumentName} isn't oneOf the correct types in ${JSON.stringify(validValues)}. Got "${value}".`,
            };
        }
    }

    public static inRange(num: number, min: number, max: number, argumentName: string): IGuardResult {
        const isInRange = num >= min && num <= max;
        if (!isInRange) {
            return {
                succeeded: false,
                message: `${argumentName} is not within range ${min} to ${max}.`,
            };
        } else {
            return { succeeded: true };
        }
    }

    public static allInRange(numbers: number[], min: number, max: number, argumentName: string): IGuardResult {
        let failingResult: IGuardResult | null = null;
        for (let num of numbers) {
            const numIsInRangeResult = this.inRange(num, min, max, argumentName);
            if (!numIsInRangeResult.succeeded) failingResult = numIsInRangeResult;
        }

        if (failingResult) {
            return { succeeded: false, message: `${argumentName} is not within the range.` };
        } else {
            return { succeeded: true };
        }
    }
}

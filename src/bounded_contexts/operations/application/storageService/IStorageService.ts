import { ReadStream } from "fs";

export interface IStorageService {
    savePlanImage(planName: string, fileName: string, file?: ReadStream): Promise<string>;
    saveRecipeImage(): Promise<string>;
}

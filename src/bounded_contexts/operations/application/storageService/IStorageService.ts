import { ReadStream } from "fs";

export interface IStorageService {
    savePlanImage(planName: string, fileName: string, file?: ReadStream): Promise<string>;
    saveRecipeImage(recipeName: string, fileExtension: string, file?: ReadStream): Promise<string>;
    getPresignedUrlForFile(objectKey: string): string;
}

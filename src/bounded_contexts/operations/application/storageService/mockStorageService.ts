import { ReadStream } from "fs";
import { IStorageService } from "./IStorageService";

export class MockStorageService implements IStorageService {

    public async savePlanImage(planName: string, fileName: string, file?: ReadStream | undefined): Promise<string> {
        throw new Error("Method not implemented.");
    }

    public async saveIconLinear(planName: string, fileName: string, file?: ReadStream | undefined): Promise<string> {
        throw new Error("Method not implemented.");
    }

    public async saveIconLinealColor(planName: string, fileName: string, file?: ReadStream | undefined): Promise<string> {
        throw new Error("Method not implemented.");
    }

    public async saveRecipeImage(recipeName: string, fileExtension: string, file?: ReadStream | undefined): Promise<string> {
        throw new Error("Method not implemented.");
    }

    public async getPresignedUrlForFile(objectKey: string): Promise<string> {
        return ""
    }

    public async getObject(objectKey: string): Promise<any> {
        throw new Error("Method not implemented.");
    }

}
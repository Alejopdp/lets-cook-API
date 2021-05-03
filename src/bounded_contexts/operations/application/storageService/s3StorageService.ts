import { IStorageService } from "./IStorageService";
import S3, { PutObjectRequest } from "aws-sdk/clients/s3";
import { ReadStream } from "fs";
import { logger } from "../../../../../config";
import path from "path";

export class S3StorageService implements IStorageService {
    private _s3: S3;

    constructor(s3: S3) {
        this._s3 = s3;
    }

    public async uploadFile(objectKey: string, file: ReadStream): Promise<void> {
        const params: PutObjectRequest = {
            Bucket: process.env.S3_BUCKET_NAME as string,
            Key: `${process.env.NODE_ENV}/${objectKey}`,
            Body: file,
            ACL: "public-read",
            ContentType: "image/jpg",
        };

        await this.s3.upload(params).promise();
    }

    public async savePlanImage(planName: string, fileExtension: string, file?: ReadStream): Promise<string> {
        try {
            if (!file) return "";
            const planNameWithoutSpaces = planName.replace(/\s/g, "_");

            const objectKey = `plans/${planNameWithoutSpaces}/${planNameWithoutSpaces}${fileExtension}`;
            await this.uploadFile(objectKey, file);

            return objectKey;
        } catch (error) {
            logger.error(error);
            throw new Error("Al cargar la imagen del plan");
        }
    }

    public async saveRecipeImage(recipeName: string, fileName: string, file?: ReadStream): Promise<string> {
        try {
            if (!file) return "";
            const recipeNameWithoutSpaces = recipeName.replace(/\s/g, "_");

            const objectKey = `recipes/${recipeNameWithoutSpaces}/${recipeNameWithoutSpaces}${path.extname(fileName)}`;
            await this.uploadFile(objectKey, file);

            return objectKey;
        } catch (error) {
            logger.error(error);
            throw new Error("Al cargar la imagen de la receta");
        }
    }

    /**
     * Getter s3
     * @return {S3}
     */
    protected get s3(): S3 {
        return this._s3;
    }
}

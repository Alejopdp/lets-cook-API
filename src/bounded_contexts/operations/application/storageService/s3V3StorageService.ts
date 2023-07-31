import { IStorageService } from "./IStorageService";
import { S3Client, PutObjectCommand, PutObjectCommandInput, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { ReadStream } from "fs";
import { logger } from "../../../../../config";
import path from "path";

export class S3StorageService implements IStorageService {
    private _s3: S3Client;

    constructor() {
        this._s3 = new S3Client({
            region: "eu-west-3",
            credentials: {
                accessKeyId: process.env.S3_ASSETS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.S3_ASSETS_SECRET_KEY!,
            },
            apiVersion: "2006-03-01",
        });
    }

    public async uploadFile(objectKey: string, file: ReadStream): Promise<void> {
        const params: PutObjectCommandInput = {
            Bucket: process.env.S3_BUCKET_NAME as string,
            Key: `${objectKey}`,
            Body: file,
            ACL: "public-read",
            ContentType: "image/jpg",
        };

        const command = new PutObjectCommand(params)

        await this.s3.send(command)
    }

    public async getPresignedUrlForFile(objectKey: string): Promise<string> {
        var params = { Bucket: process.env.S3_BUCKET_NAME, Key: objectKey };
        const command = new GetObjectCommand(params)
        const url: string = await getSignedUrl(this.s3, command);

        return url;
    }

    public async savePlanImage(planName: string, fileName: string, file?: ReadStream): Promise<string> {
        try {
            if (!file) return "";
            const planNameWithoutSpaces = planName.replace(/\s/g, "_");

            const objectKey = `${process.env.NODE_ENV}/plans/${planNameWithoutSpaces}/${planNameWithoutSpaces}${path.extname(fileName)}`;
            await this.uploadFile(objectKey, file);

            return objectKey;
        } catch (error: any) {
            logger.error(error);
            throw new Error("Al cargar la imagen del plan");
        }
    }

    public async saveIconLinear(planName: string, fileName: string, file?: ReadStream): Promise<string> {
        if (!file) return "";
        const planNameWithoutSpaces = planName.replace(/\s/g, "_");

        const objectKey = `${process.env.NODE_ENV}/plans/${planNameWithoutSpaces}/icon-${path.extname(fileName)}`;
        await this.uploadFile(objectKey, file);

        return objectKey;
    }

    public async saveIconLinealColor(planName: string, fileName: string, file?: ReadStream): Promise<string> {
        if (!file) return "";
        const planNameWithoutSpaces = planName.replace(/\s/g, "_");

        const objectKey = `${process.env.NODE_ENV}/plans/${planNameWithoutSpaces}/icon-with-color${path.extname(fileName)}`;
        await this.uploadFile(objectKey, file);

        return objectKey;
    }

    public async saveRecipeImage(recipeName: string, fileName: string, file?: ReadStream): Promise<string> {
        try {
            if (!file) return "";
            const recipeNameWithoutSpaces = recipeName.replace(/\s/g, "_");
            const fileNameWithoutSpaces = fileName.replace(/\s/g, "_");

            const objectKey = `${process.env.NODE_ENV}/recipes/${recipeNameWithoutSpaces}/${fileNameWithoutSpaces}`;
            await this.uploadFile(objectKey, file);

            return objectKey;
        } catch (error: any) {
            logger.error(error);
            throw new Error("Al cargar la imagen de la receta");
        }
    }

    public async getObject(objectKey: string): Promise<any> {
        throw new Error("Not implemented yet");
    }

    /**
     * Getter s3
     * @return {S3Client}
     */
    protected get s3(): S3Client {
        return this._s3;
    }
}

import { s3 } from "../../../../infraestructure/aws/s3Config";
import { IStorageService } from "./IStorageService";
import { S3StorageService } from "./s3StorageService";

export const s3Service: IStorageService = new S3StorageService(s3);

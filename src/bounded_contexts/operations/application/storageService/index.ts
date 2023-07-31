// import { s3 } from "../../../../infraestructure/aws/s3Config";
import { IStorageService } from "./IStorageService";
// import { S3StorageService } from "./s3StorageService";
import { V3S3StorageService } from "./s3V3StorageService"

// export const s3Service: IStorageService = new S3StorageService(s3);
export const v3S3Service: IStorageService = new V3S3StorageService();
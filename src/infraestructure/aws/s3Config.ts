import S3 from "aws-sdk/clients/s3";

export const s3 = new S3({
    accessKeyId: process.env.S3_ASSETS_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_ASSETS_SECRET_KEY,
    apiVersion: "2006-03-01",
});

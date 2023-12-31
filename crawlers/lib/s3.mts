import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import axios from "axios";
import dotenv from "dotenv";

const env = dotenv.config().parsed!;

const accessKeyId = process.env.AWS_ACCESS_KEY_ID || env.AWS_ACCESS_KEY_ID!;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || env.AWS_SECRET_ACCESS_KEY!;
const region = process.env.S3_REGION || env.S3_REGION;
const Bucket = process.env.S3_BUCKET || env.S3_BUCKET;

const s3client = new S3Client({
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  region,
});

export async function readFromS3(filaName: string) {
  return axios
    .get(`https://s3.eu-central-1.amazonaws.com/sub.rehab/${filaName}`)
    .then((res) => res.data);
}

export function writeToAWS(fileName: string, content: string) {
  new Upload({
    client: s3client,
    params: { ACL: "public-read", Bucket, Key: fileName, Body: content },
    queueSize: 4, // optional concurrency configuration
    partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
    leavePartsOnError: false, // optional manually handle dropped parts
  })
    .done()
    .then((data: any) => console.log("S3 Upload complete", data))
    .catch((err: any) => console.log("Error during S3 Upload:", err));
}

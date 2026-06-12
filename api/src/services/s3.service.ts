import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Image } from "../types";

const client = new S3Client({
  region: process.env.AWS_REGION ?? "us-east-1",
  ...(process.env.AWS_ENDPOINT_URL && {
    endpoint: process.env.AWS_ENDPOINT_URL,
    forcePathStyle: true,
  }),
});

const BUCKET = process.env.S3_BUCKET_NAME as string;
const EXPIRES = parseInt(process.env.S3_PRESIGNED_URL_EXPIRES || "3600", 10);

export async function listScreenshots(prefix?: string): Promise<S3Image[]> {
  const command = new ListObjectsV2Command({
    Bucket: BUCKET,
    Prefix: prefix || "screenshots/",
  });

  const response = await client.send(command);
  const contents = response.Contents || [];

  const images: S3Image[] = await Promise.all(
    contents.map(async (obj) => {
      const key = obj.Key as string;
      const url = await getSignedUrl(
        client,
        new GetObjectCommand({ Bucket: BUCKET, Key: key }),
        { expiresIn: EXPIRES },
      );
      return {
        key,
        url,
        lastModified: obj.LastModified,
        size: obj.Size,
      };
    }),
  );

  return images;
}

export async function getPresignedUrl(key: string): Promise<string> {
  return getSignedUrl(
    client,
    new GetObjectCommand({ Bucket: BUCKET, Key: key }),
    { expiresIn: EXPIRES },
  );
}

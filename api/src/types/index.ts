export interface ScreenshotRequest {
  url: string;
  fullPage?: boolean;
  width?: number;
  height?: number;
}

export interface ScreenshotJob {
  jobId: string;
  url: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  createdAt: string;
}

export interface S3Image {
  key: string;
  url: string;
  lastModified?: Date;
  size?: number;
}

export interface LambdaPayload {
  jobId: string;
  url: string;
  fullPage: boolean;
  s3Bucket: string;
  s3Key: string;
}

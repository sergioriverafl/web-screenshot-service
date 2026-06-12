export interface ScreenshotPayload {
  jobId: string;
  url: string;
  fullPage: boolean;
  width: number;
  height: number;
  s3Bucket: string;
  s3Key: string;
}

export interface ScreenshotResult {
  jobId: string;
  s3Key: string;
  s3Bucket: string;
  url: string;
  durationMs: number;
}

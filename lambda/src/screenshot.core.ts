import { randomUUID } from "crypto";
import { createBrowser } from "./browser";
import { uploadToS3 } from "./s3";
import { ScreenshotPayload, ScreenshotResult } from "./types";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const IS_LAMBDA = !!process.env.AWS_EXECUTION_ENV || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

export async function runScreenshot(
  payload: Partial<ScreenshotPayload> & { url: string },
): Promise<ScreenshotResult> {
  const {
    url,
    jobId = randomUUID(),
    fullPage = true,
    width = 1280,
    height = 800,
    s3Bucket = process.env.S3_BUCKET_NAME as string,
    s3Key = `screenshots/${jobId}.png`,
  } = payload;

  const startTime = Date.now();
  let browser = null;

  try {
    browser = await createBrowser();
    const page = await browser.newPage();

    await page.setViewportSize({ width, height });
    await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 });
    await page.waitForTimeout(1_500);

    const screenshotBuffer = await page.screenshot({ fullPage, type: "png" });

    if (IS_LAMBDA) {
      // Producción: sube a S3
      await uploadToS3(s3Bucket, s3Key, Buffer.from(screenshotBuffer));
    } else {
      // Local: guarda en lambda/public/
      const publicDir = join(__dirname, "../public");
      mkdirSync(publicDir, { recursive: true });
      const filePath = join(publicDir, `${jobId}.png`);
      writeFileSync(filePath, screenshotBuffer);
      console.log(`📁 Screenshot guardado en: ${filePath}`);
    }

    const durationMs = Date.now() - startTime;
    return { jobId, url, s3Bucket, s3Key, durationMs };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[${jobId}] ❌ ${message}`);
    throw error;
  } finally {
    if (browser) await browser.close();
  }
}
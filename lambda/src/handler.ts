import { Context } from "aws-lambda";
import { ScreenshotPayload, ScreenshotResult } from "./types";
import { runScreenshot } from "./screenshot.core";

export async function handler(
  event: ScreenshotPayload,
  _context: Context,
): Promise<ScreenshotResult> {
  return runScreenshot(event);
}

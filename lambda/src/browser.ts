import { chromium as playwrightChromium, Browser } from 'playwright-core';

const IS_LAMBDA = !!process.env.AWS_EXECUTION_ENV || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

export async function createBrowser(): Promise<Browser> {
  if (IS_LAMBDA) {
    // En Lambda: usa el binario de sparticuz (Amazon Linux)
    const chromium = await import('@sparticuz/chromium');
    const executablePath = await chromium.default.executablePath();

    return playwrightChromium.launch({
      args: chromium.default.args,
      executablePath,
      headless: true,
    });
  }

  // En local: usa el Chromium instalado por Playwright
  return playwrightChromium.launch({
    headless: true,
  });
}
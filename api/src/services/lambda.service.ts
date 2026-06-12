import {
  LambdaClient,
  InvokeCommand,
  InvocationType,
} from '@aws-sdk/client-lambda';
import { LambdaPayload } from '../types';

const IS_LOCAL = process.env.NODE_ENV !== 'production';

async function invokeLocal(payload: LambdaPayload): Promise<void> {
  const { runScreenshot } = await import('../../../lambda/src/screenshot.core');
  await runScreenshot(payload);
}

async function invokeRemote(payload: LambdaPayload): Promise<void> {
  const client = new LambdaClient({
    region: process.env.AWS_REGION || 'us-east-1',
    ...(process.env.AWS_ENDPOINT_URL && {
      endpoint: process.env.AWS_ENDPOINT_URL,
    }),
  });

  const command = new InvokeCommand({
    FunctionName: process.env.LAMBDA_FUNCTION_NAME,
    InvocationType: InvocationType.Event,
    Payload: Buffer.from(JSON.stringify(payload)),
  });

  await client.send(command);
}

export async function invokeLambda(payload: LambdaPayload): Promise<void> {
  if (IS_LOCAL) {
    console.log('🛠️  Modo local: ejecutando runScreenshot directamente');
    return invokeLocal(payload);
  }

  return invokeRemote(payload);
}
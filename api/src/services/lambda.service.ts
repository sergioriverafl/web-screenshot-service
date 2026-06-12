import {
  LambdaClient,
  InvokeCommand,
  InvocationType,
} from '@aws-sdk/client-lambda';
import { LambdaPayload } from '../types';

const client = new LambdaClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

export async function invokeLambda(payload: LambdaPayload): Promise<void> {
  const command = new InvokeCommand({
    FunctionName: process.env.LAMBDA_FUNCTION_NAME,
    InvocationType: InvocationType.Event, // Asíncrono (fire-and-forget)
    Payload: Buffer.from(JSON.stringify(payload)),
  });

  await client.send(command);
}

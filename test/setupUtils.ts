/* eslint-disable import/no-extraneous-dependencies */
import { CloudFormationClient, DescribeStacksCommand, Stack } from '@aws-sdk/client-cloudformation';

const region = process.env.AWS_REGION || 'us-east-1';

export const getRestServiceEndpoint = (stack: Stack) =>
  stack.Outputs?.find((o) => o.OutputKey === 'HttpApiUrl')?.OutputValue;

export const getStack = async (stackName: string): Promise<Stack> => {
  const cfn = new CloudFormationClient({ region });
  const stackResult = await cfn.send(new DescribeStacksCommand({ StackName: stackName }));
  const stack = stackResult.Stacks?.[0];
  if (!stack) {
    throw new Error(`Couldn't find stack with name ${stackName}`);
  }

  return stack;
};

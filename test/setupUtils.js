import { CloudFormationClient, DescribeStacksCommand } from '@aws-sdk/client-cloudformation';
import axios from 'axios';

const region = process.env.AWS_REGION || 'us-east-1';

export const getRestServiceEndpoint = (stack) =>
  stack.Outputs?.find((o) => o.OutputKey === 'HttpApiUrl')?.OutputValue;

export const getStack = async (stackName) => {
  const cfn = new CloudFormationClient({ region });
  const stackResult = await cfn.send(new DescribeStacksCommand({ StackName: stackName }));
  const stack = stackResult.Stacks?.[0];
  if (!stack) {
    throw new Error(`Couldn't find stack with name ${stackName}`);
  }

  return stack;
};

/**
 * A freshly created HTTP API answers 404 for a few seconds while its routes and
 * stage propagate (this happens on the first deploy after the weekly teardown).
 * Poll until the API stops returning 404 so the E2E suites don't race the deploy.
 * Any other status (e.g. 401/403 from the authorizer) means the route is live.
 */
export const waitForApiReady = async ({ apiUrl, path, timeoutMs = 60000, intervalMs = 2000 }) => {
  const deadline = Date.now() + timeoutMs;
  let status;
  do {
    ({ status } = await axios.get(path, { baseURL: apiUrl, validateStatus: () => true }));
    if (status !== 404) {
      return status;
    }
    await new Promise((resolve) => {
      setTimeout(resolve, intervalMs);
    });
  } while (Date.now() < deadline);

  throw new Error(`API at ${apiUrl}${path} still returned 404 after ${timeoutMs}ms`);
};

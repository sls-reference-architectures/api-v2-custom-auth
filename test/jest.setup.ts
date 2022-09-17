import {
  getRestServiceEndpoint as getApiUrl,
  getStack,
} from './setupUtils';

const region = process.env.AWS_REGION || 'us-east-1';
const stage = process.env.STAGE || 'dev';

const setup = async (): Promise<void> => {
  const stackName = `api-v2-jwt-auth-${stage}`;

  const stack = await getStack(stackName);
  const apiUrl = getApiUrl(stack);

  process.env.AWS_REGION = region;
  process.env.STAGE = stage;
  process.env.NODE_ENV = stage;
  process.env.API_URL = apiUrl;
};

export default setup;

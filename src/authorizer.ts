import {
  APIGatewayAuthorizerResultContext,
  APIGatewayProxyEventV2 as Event,
} from 'aws-lambda';
import Logger from '@dazn/lambda-powertools-logger';

const authorizer = async (event: Event): Promise<APIGatewayAuthorizerResultSimpleV2> => {
  Logger.debug('In authorizer handler', { event });
  const { headers: { authorization: authHeader } } = event;
  Logger.debug('got authHeader', { headers: event.headers, authHeader });
  let isAuthorized = false;
  if (isValid(authHeader as string)) {
    isAuthorized = true;
  }

  return {
    isAuthorized,
    context: {
      exampleKey: 'exampleValue',
    },
  };
};

const isValid = (authHeader: string): boolean => {
  const token = parseBearerToken(authHeader);

  // Super-simple!
  return isNumeric(token);
};

const parseBearerToken = (value: string): string => {
  const apiKey = value.slice(7).trim();

  return apiKey;
};

const isNumeric = (token: string): boolean => (/^-?\d+$/.test(token));

export default authorizer;

// Missing from @types/aws-sdk, so defined here
interface APIGatewayAuthorizerResultSimpleV2 {
  isAuthorized: boolean,
  context: APIGatewayAuthorizerResultContext,
}

import { Logger } from '@aws-lambda-powertools/logger';

const logger = new Logger({ serviceName: 'v2CustomAuth' });

const authorizer = async (event) => {
  logger.debug('In authorizer handler', { event });
  const {
    headers: { authorization: authHeader },
  } = event;
  logger.debug('got authHeader', { headers: event.headers, authHeader });
  let isAuthorized = false;
  if (isValid(authHeader)) {
    isAuthorized = true;
  }

  return {
    isAuthorized,
    context: {
      exampleKey: 'exampleValue',
    },
  };
};

const isValid = (authHeader) => {
  const token = parseBearerToken(authHeader);

  // Super-simple!
  return isNumeric(token);
};

const parseBearerToken = (value) => {
  const apiKey = value.slice(7).trim();

  return apiKey;
};

const isNumeric = (token) => /^-?\d+$/.test(token);

export default authorizer;

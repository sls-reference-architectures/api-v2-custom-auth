import Logger from '@dazn/lambda-powertools-logger';

const authorizer = async (event) => {
  Logger.debug('In authorizer handler', { event });
  const {
    headers: { authorization: authHeader },
  } = event;
  Logger.debug('got authHeader', { headers: event.headers, authHeader });
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

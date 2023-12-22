import {
  APIGatewayProxyEventV2 as Event,
  APIGatewayProxyStructuredResultV2 as Result,
} from 'aws-lambda';
import Logger from '@dazn/lambda-powertools-logger';
import httpErrorHandler from '@middy/http-error-handler';
import middy from '@middy/core';

const getGreeting = async (event: Event): Promise<Result> => {
  Logger.debug('In getGreeting handler', { event });

  return {
    statusCode: 200,
    body: JSON.stringify({ greeting: 'Hello from main handler' }),
  };
};

const handler = middy(getGreeting)
  .use(httpErrorHandler());

export default handler;

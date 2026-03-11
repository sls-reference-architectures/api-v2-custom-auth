import httpErrorHandler from '@middy/http-error-handler';
import middy from '@middy/core';
import ioLogger from '@middy/input-output-logger';

import ioLoggerConfig from './middyIoLoggerConfiguration';

const getGreeting = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ greeting: 'Hello from main handler', event }),
  };
};

const handler = middy()
  .use(ioLogger(ioLoggerConfig('YourServiceName')))
  .use(httpErrorHandler())
  .handler(getGreeting);

export default handler;

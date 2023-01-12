import { UnauthorizedError } from '@vending-machine/errors/unauthorized-error';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

export const withoutAuthentication =
  (handler: NextApiHandler) => async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.cookies.token) {
      throw new UnauthorizedError('Unauthorized');
    }

    return handler(request, response);
  };

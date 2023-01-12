import { Role } from '@vending-machine/domains/user/entity';
import { UnauthorizedError } from '@vending-machine/errors/unauthorized-error';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

export const withRole =
  (role: Role, handler: NextApiHandler) => async (request: NextApiRequest, response: NextApiResponse) => {
    if (!request.user || request.user.role !== role) {
      throw new UnauthorizedError('Unauthorized');
    }

    return handler(request, response);
  };

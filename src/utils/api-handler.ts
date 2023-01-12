import { ConflictError } from '@vending-machine/errors/conflict-error';
import { NotFoundError } from '@vending-machine/errors/not-found-error';
import { UnauthorizedError } from '@vending-machine/errors/unauthorized-error';
import { Response } from '@vending-machine/types/api';
import { logger } from '@vending-machine/utils/logger';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

export const apiHandler =
  (handler: Record<string, NextApiHandler>) =>
  async (request: NextApiRequest, response: NextApiResponse<unknown | Response>) => {
    const method = request.method?.toLowerCase() ?? 'get';
    const nextApiHandler = handler[method];
    if (!nextApiHandler) {
      return response.status(405).send({ message: `Method ${method} not allowed` });
    }

    try {
      return await nextApiHandler(request, response);
    } catch (error) {
      logger.error(error);

      if (error instanceof NotFoundError) {
        return response.status(404).send({ message: error.message });
      }

      if (error instanceof ConflictError) {
        return response.status(409).send({ message: error.message });
      }

      if (error instanceof UnauthorizedError) {
        return response.status(401).send({ message: error.message });
      }

      return response.status(500).send({ message: 'Error occured' });
    }
  };

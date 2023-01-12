import { sanitize } from '@vending-machine/utils/sanitize';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { SchemaOf } from 'yup';

export const validateInput =
  <T>(handler: NextApiHandler, schema: SchemaOf<T>) =>
  async (request: NextApiRequest, response: NextApiResponse) => {
    try {
      request.body = await schema.validate(sanitize(request.body), { strict: true, abortEarly: false });
    } catch (error) {
      return response.status(400).json(error);
    }

    return handler(request, response);
  };

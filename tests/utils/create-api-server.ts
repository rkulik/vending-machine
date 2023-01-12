import buy from '@vending-machine/pages/api/buy';
import deposit from '@vending-machine/pages/api/deposit';
import products from '@vending-machine/pages/api/products';
import product from '@vending-machine/pages/api/products/[id]';
import { createServer as createHttpServer, IncomingMessage, ServerResponse } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';
import { apiResolver } from 'next/dist/server/api-utils/node';

const routes: {
  regex: RegExp;
  handler: (request: NextApiRequest, response: NextApiResponse<unknown>) => Promise<unknown>;
}[] = [
  { regex: /^\/api\/deposit$/, handler: deposit },
  { regex: /^\/api\/buy$/, handler: buy },
  { regex: /^\/api\/products$/, handler: products },
  {
    regex: /^\/api\/products\/[1-9][0-9]*$/,
    handler: (request: NextApiRequest, response: NextApiResponse) => {
      const urlParts = request.url!.split('/');
      const productId = urlParts[urlParts.length - 1];
      request.query = { ...request.query, id: productId };

      return product(request, response);
    },
  },
];

export const createApiServer = () =>
  createHttpServer((request: IncomingMessage, response: ServerResponse) =>
    apiResolver(
      request,
      response,
      undefined,
      (request: NextApiRequest, response: NextApiResponse) =>
        routes.find(route => route.regex.test(request.url!))?.handler(request, response),
      {
        previewModeId: 'id',
        previewModeEncryptionKey: 'key',
        previewModeSigningKey: 'key',
      },
      true,
    ),
  );

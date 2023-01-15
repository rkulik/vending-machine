import { deleteProduct, getProductById, updateProduct } from '@vending-machine/domains/product';
import { Product } from '@vending-machine/domains/product/entity';
import { UnauthorizedError } from '@vending-machine/errors/unauthorized-error';
import { withAuthentication } from '@vending-machine/middlewares/with-authentication';
import { withRole } from '@vending-machine/middlewares/with-role';
import { saveProductSchema } from '@vending-machine/schemas';
import { Response } from '@vending-machine/types/api';
import { Role } from '@vending-machine/types/user';
import { apiHandler } from '@vending-machine/utils/api-handler';
import { validateInput } from '@vending-machine/utils/validate-input';
import { NextApiRequest, NextApiResponse } from 'next';

const getProductHandler = async (request: NextApiRequest, response: NextApiResponse<Product>) =>
  response.json(await getProductById(parseInt(request.query.id as string)));

const updateProductHandler = async (request: NextApiRequest, response: NextApiResponse<Product>) => {
  const productId = parseInt(request.query.id as string);
  if (!request.user!.productIds.includes(productId)) {
    throw new UnauthorizedError('Unauthorized');
  }

  response.json(await updateProduct({ ...request.body, id: productId }));
};

const deleteProductHandler = async (request: NextApiRequest, response: NextApiResponse<Response>) => {
  const productId = parseInt(request.query.id as string);
  if (!request.user!.productIds.includes(productId)) {
    throw new UnauthorizedError('Unauthorized');
  }

  await deleteProduct(productId);
  response.status(203).json({ message: `Product ${productId} deleted` });
};

// eslint-disable-next-line import/no-default-export
export default apiHandler({
  get: withAuthentication(getProductHandler),
  patch: withAuthentication(withRole(Role.SELLER, validateInput(updateProductHandler, saveProductSchema))),
  delete: withAuthentication(withRole(Role.SELLER, deleteProductHandler)),
});

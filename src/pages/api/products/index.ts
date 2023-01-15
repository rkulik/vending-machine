import { createProduct, getProducts } from '@vending-machine/domains/product';
import { Product } from '@vending-machine/domains/product/entity';
import { withAuthentication } from '@vending-machine/middlewares/with-authentication';
import { withRole } from '@vending-machine/middlewares/with-role';
import { saveProductSchema } from '@vending-machine/schemas';
import { Role } from '@vending-machine/types/user';
import { apiHandler } from '@vending-machine/utils/api-handler';
import { validateInput } from '@vending-machine/utils/validate-input';
import { NextApiRequest, NextApiResponse } from 'next';

const getProductsHandler = async (_request: NextApiRequest, response: NextApiResponse<Product[]>) =>
  response.json(await getProducts());

const createProductHandler = async (request: NextApiRequest, response: NextApiResponse<Product>) =>
  response.json(await createProduct(request.body, request.user!));

// eslint-disable-next-line import/no-default-export
export default apiHandler({
  get: withAuthentication(getProductsHandler),
  post: withAuthentication(withRole(Role.SELLER, validateInput(createProductHandler, saveProductSchema))),
});

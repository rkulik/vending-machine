import { buy } from '@vending-machine/domains/user';
import { Role } from '@vending-machine/domains/user/entity';
import { withAuthentication } from '@vending-machine/middlewares/with-authentication';
import { withRole } from '@vending-machine/middlewares/with-role';
import { buySchema } from '@vending-machine/schemas';
import { apiHandler } from '@vending-machine/utils/api-handler';
import { validateInput } from '@vending-machine/utils/validate-input';
import { NextApiRequest, NextApiResponse } from 'next';

const buyHandler = async (request: NextApiRequest, response: NextApiResponse) =>
  response.json(await buy(request.body, request.user!));

// eslint-disable-next-line import/no-default-export
export default apiHandler({
  post: withAuthentication(withRole(Role.BUYER, validateInput(buyHandler, buySchema))),
});

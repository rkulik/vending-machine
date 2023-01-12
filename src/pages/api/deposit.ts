import { deposit } from '@vending-machine/domains/user';
import { Role, User } from '@vending-machine/domains/user/entity';
import { withAuthentication } from '@vending-machine/middlewares/with-authentication';
import { withRole } from '@vending-machine/middlewares/with-role';
import { depositSchema } from '@vending-machine/schemas';
import { apiHandler } from '@vending-machine/utils/api-handler';
import { validateInput } from '@vending-machine/utils/validate-input';
import { NextApiRequest, NextApiResponse } from 'next';

const depositHandler = async (request: NextApiRequest, response: NextApiResponse<User>) =>
  response.json(await deposit(request.body, request.user!));

// eslint-disable-next-line import/no-default-export
export default apiHandler({
  post: withAuthentication(withRole(Role.BUYER, validateInput(depositHandler, depositSchema))),
});

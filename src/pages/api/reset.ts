import { reset } from '@vending-machine/domains/user';
import { Role, User } from '@vending-machine/domains/user/entity';
import { withAuthentication } from '@vending-machine/middlewares/with-authentication';
import { withRole } from '@vending-machine/middlewares/with-role';
import { apiHandler } from '@vending-machine/utils/api-handler';
import { NextApiRequest, NextApiResponse } from 'next';

const resetHandler = async (request: NextApiRequest, response: NextApiResponse<User>) =>
  response.json(await reset(request.user!));

// eslint-disable-next-line import/no-default-export
export default apiHandler({
  get: withAuthentication(withRole(Role.BUYER, resetHandler)),
});

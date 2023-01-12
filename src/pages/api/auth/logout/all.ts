import { logoutAll } from '@vending-machine/domains/auth';
import { withAuthentication } from '@vending-machine/middlewares/with-authentication';
import { Response } from '@vending-machine/types/api';
import { apiHandler } from '@vending-machine/utils/api-handler';
import { removeTokenCookie } from '@vending-machine/utils/cookie';
import { NextApiRequest, NextApiResponse } from 'next';

const logoutAllHandler = async (request: NextApiRequest, response: NextApiResponse<Response>) => {
  await logoutAll(request.user!);
  removeTokenCookie(response);
  response.json({ message: 'Successfully logged out all' });
};

// eslint-disable-next-line import/no-default-export
export default apiHandler({ get: withAuthentication(logoutAllHandler) });

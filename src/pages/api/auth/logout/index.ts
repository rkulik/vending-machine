import { logout } from '@vending-machine/domains/auth';
import { withAuthentication } from '@vending-machine/middlewares/with-authentication';
import { Response } from '@vending-machine/types/api';
import { apiHandler } from '@vending-machine/utils/api-handler';
import { removeTokenCookie } from '@vending-machine/utils/cookie';
import { NextApiRequest, NextApiResponse } from 'next';

const logoutHandler = async (request: NextApiRequest, response: NextApiResponse<Response>) => {
  await logout(request.tokenId!);
  removeTokenCookie(response);
  response.json({ message: 'Successfully logged out' });
};

// eslint-disable-next-line import/no-default-export
export default apiHandler({ get: withAuthentication(logoutHandler) });

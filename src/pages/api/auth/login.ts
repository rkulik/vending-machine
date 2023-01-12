import { login } from '@vending-machine/domains/auth';
import { User } from '@vending-machine/domains/user/entity';
import { withoutAuthentication } from '@vending-machine/middlewares/without-authentication';
import { loginSchema } from '@vending-machine/schemas';
import { apiHandler } from '@vending-machine/utils/api-handler';
import { setTokenCookie } from '@vending-machine/utils/cookie';
import { validateInput } from '@vending-machine/utils/validate-input';
import { NextApiRequest, NextApiResponse } from 'next';

const loginHandler = async (request: NextApiRequest, response: NextApiResponse<User>) => {
  const { user, token } = await login(request.body);
  setTokenCookie(response, token);

  response.json(user);
};

// eslint-disable-next-line import/no-default-export
export default apiHandler({ post: withoutAuthentication(validateInput(loginHandler, loginSchema)) });

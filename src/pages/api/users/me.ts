import { deleteUser, updateUser } from '@vending-machine/domains/user';
import { User } from '@vending-machine/domains/user/entity';
import { withAuthentication } from '@vending-machine/middlewares/with-authentication';
import { saveUserSchema } from '@vending-machine/schemas';
import { Response } from '@vending-machine/types/api';
import { apiHandler } from '@vending-machine/utils/api-handler';
import { removeTokenCookie } from '@vending-machine/utils/cookie';
import { validateInput } from '@vending-machine/utils/validate-input';
import { NextApiRequest, NextApiResponse } from 'next';

const getMeHandler = async (request: NextApiRequest, response: NextApiResponse<User>) => response.json(request.user!);

const updateMeHandler = async (request: NextApiRequest, response: NextApiResponse<User>) =>
  response.json(await updateUser(request.body, request.user!));

const deleteMeHandler = async (request: NextApiRequest, response: NextApiResponse<Response>) => {
  await deleteUser(request.user!);
  removeTokenCookie(response);
  response.status(203).json({ message: `User ${request.user!.id} deleted` });
};

// eslint-disable-next-line import/no-default-export
export default apiHandler({
  get: withAuthentication(getMeHandler),
  patch: withAuthentication(validateInput(updateMeHandler, saveUserSchema)),
  delete: withAuthentication(deleteMeHandler),
});

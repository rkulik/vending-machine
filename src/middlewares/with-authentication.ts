import { getActiveLogin } from '@vending-machine/domains/active-login';
import { decodeToken, isTokenExpired, refreshToken as refreshOldToken } from '@vending-machine/domains/auth';
import { getUserById } from '@vending-machine/domains/user';
import { UnauthorizedError } from '@vending-machine/errors/unauthorized-error';
import { removeTokenCookie, setTokenCookie } from '@vending-machine/utils/cookie';

import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

const getRequestingUserById = async (id: number) => {
  try {
    const user = await getUserById(id);

    return user;
  } catch {
    return undefined;
  }
};

export const withAuthentication =
  (handler: NextApiHandler) => async (request: NextApiRequest, response: NextApiResponse) => {
    if (!request.cookies.token) {
      throw new UnauthorizedError('Unauthorized');
    }

    const { id, accessToken, refreshToken } = decodeToken(request.cookies.token);
    const requestingUser = await getRequestingUserById(accessToken.user.id);
    if (!requestingUser) {
      removeTokenCookie(response);
      throw new UnauthorizedError('Unauthorized');
    }

    const activeLogin = await getActiveLogin(requestingUser, id);
    if (!activeLogin) {
      removeTokenCookie(response);
      throw new UnauthorizedError('Unauthorized');
    }

    if (!isTokenExpired(accessToken)) {
      request.user = requestingUser;
      request.tokenId = id;

      return handler(request, response);
    }

    if (isTokenExpired(refreshToken)) {
      removeTokenCookie(response);
      throw new UnauthorizedError('Unauthorized');
    }

    setTokenCookie(response, refreshOldToken(request.cookies.token));
    request.user = requestingUser;
    request.tokenId = id;

    return handler(request, response);
  };

import { config } from '@vending-machine/config';
import { serialize } from 'cookie';
import { NextApiResponse } from 'next';

const COOKIE_NAME = 'token';

export const setTokenCookie = (response: NextApiResponse, token: string) => {
  response.setHeader(
    'Set-Cookie',
    serialize(COOKIE_NAME, token, { maxAge: config.auth.refreshToken.lifetime, httpOnly: true, path: '/' }),
  );
};

export const removeTokenCookie = (response: NextApiResponse) => {
  response.setHeader('Set-Cookie', serialize(COOKIE_NAME, '', { maxAge: -1, httpOnly: true, path: '/' }));
};

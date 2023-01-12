import { config } from '@vending-machine/config';
import {
  createActiveLogin,
  deleteActiveLoginByTokenId,
  deleteAllActiveLoginsByUser,
} from '@vending-machine/domains/active-login';
import { createUser, getUserById, getUserWithPasswordByUsername } from '@vending-machine/domains/user';
import { User } from '@vending-machine/domains/user/entity';
import { ConflictError } from '@vending-machine/errors/conflict-error';
import { NotFoundError } from '@vending-machine/errors/not-found-error';
import { Login, SaveUser } from '@vending-machine/schemas';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';

const SALT_OR_ROUNDS = 10;
const TIMESTAMP_ERROR_MARGIN = 300;

type AccessToken = {
  user: { id: number };
  iat: number;
  exp: number;
};

type Token = {
  id: string;
  accessToken: AccessToken;
  refreshToken: AccessToken;
};

type TokenPayload = {
  id: string;
  accessToken: string;
  refreshToken: string;
};

export const hashPassword = (password: string) => bcrypt.hash(password, SALT_OR_ROUNDS);

const validatePassword = (password: string, encryptedPassword: string) => bcrypt.compare(password, encryptedPassword);

const sign = (payload: object, secret: string, lifetime?: number) =>
  jwt.sign(payload, secret, lifetime ? { expiresIn: lifetime } : undefined);

const signToken = (user: User) => {
  const payload = { user: { id: user.id } };
  const { token, accessToken, refreshToken } = config.auth;

  return sign(
    {
      id: uuid(),
      accessToken: sign(payload, accessToken.secret, accessToken.lifetime),
      refreshToken: sign(payload, refreshToken.secret, refreshToken.lifetime),
    },
    token.secret,
  );
};

export const decodeToken = (token: string): Token => {
  const { auth } = config;
  const tokenPayload = jwt.verify(token, auth.token.secret) as TokenPayload;

  return {
    id: tokenPayload.id,
    accessToken: jwt.verify(tokenPayload.accessToken, auth.accessToken.secret) as AccessToken,
    refreshToken: jwt.verify(tokenPayload.refreshToken, auth.refreshToken.secret) as AccessToken,
  };
};

export const isTokenExpired = (token: AccessToken) => token.exp * 1000 < Date.now() - TIMESTAMP_ERROR_MARGIN;

export const refreshToken = (oldToken: string) => {
  const { auth } = config;
  const {
    accessToken: { user },
    refreshToken,
  } = decodeToken(oldToken);

  return sign(
    {
      accessToken: sign({ user }, auth.accessToken.secret, auth.accessToken.lifetime),
      refreshToken,
    },
    auth.token.secret,
  );
};

export const register = async (input: SaveUser) => {
  const user = await createUser(input);
  const token = signToken(user);
  const { id } = decodeToken(token);
  await createActiveLogin(user, id);

  return { user, token };
};

export const login = async (input: Login) => {
  try {
    const user = await getUserWithPasswordByUsername(input.username);
    if (!(await validatePassword(input.password, user.password))) {
      throw new ConflictError('Wrong username or password');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...reducedUser } = user;
    const token = signToken(reducedUser as User);
    const { id } = decodeToken(token);
    await createActiveLogin(user, id);

    return { user: await getUserById(reducedUser.id), token };
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new ConflictError('Wrong username or password');
    }

    throw error;
  }
};

export const logout = (tokenId: string) => deleteActiveLoginByTokenId(tokenId);

export const logoutAll = (user: User) => deleteAllActiveLoginsByUser(user);

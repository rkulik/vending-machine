import { ActiveLogin } from '@vending-machine/domains/active-login/entity';
import { User } from '@vending-machine/domains/user/entity';
import { getDb } from '@vending-machine/services/database';

export const createActiveLogin = async (user: User, tokenId: string) => {
  const activeLogin = new ActiveLogin();
  activeLogin.user = user;
  activeLogin.tokenId = tokenId;

  return (await getDb()).getRepository<ActiveLogin>('ActiveLogin').save(activeLogin);
};

export const getActiveLogin = async (user: User, tokenId: string) =>
  (await getDb()).getRepository<ActiveLogin>('ActiveLogin').findOne({
    where: {
      tokenId,
      user: { id: user.id },
    },
  });

export const deleteActiveLoginByTokenId = async (tokenId: string) =>
  (await getDb()).getRepository<ActiveLogin>('ActiveLogin').delete({ tokenId });

export const deleteAllActiveLoginsByUser = async (user: User) =>
  (await getDb()).getRepository<ActiveLogin>('ActiveLogin').delete({ user: { id: user.id } });

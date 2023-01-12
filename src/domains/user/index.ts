import { hashPassword } from '@vending-machine/domains/auth';
import { getProductById } from '@vending-machine/domains/product';
import { Product } from '@vending-machine/domains/product/entity';
import { Role, User } from '@vending-machine/domains/user/entity';
import { ConflictError } from '@vending-machine/errors/conflict-error';
import { NotFoundError } from '@vending-machine/errors/not-found-error';
import { Buy, Deposit, SaveUser } from '@vending-machine/schemas';
import { getDb } from '@vending-machine/services/database';
import { chunk, ChunkResult } from '@vending-machine/utils/chunk';

const DEFAULT_DEPOSIT = 0;
export const ALLOWED_DEPOSIT_VALUES = [5, 10, 20, 50, 100];

export const getUserWithPasswordByUsername = async (username: string) => {
  const user = await (await getDb()).getRepository<User>('User').findOne({
    where: { username },
    select: { id: true, username: true, password: true, deposit: true, role: true },
  });
  if (!user) {
    throw new NotFoundError(`User not found`);
  }

  return user;
};

const checkUsernameConflict = async (username: string) => {
  try {
    const existingUser = await getUserWithPasswordByUsername(username);
    if (existingUser) {
      throw new ConflictError('Username already taken');
    }
  } catch (error) {
    if (!(error instanceof NotFoundError)) {
      throw error;
    }
  }
};

export const createUser = async (input: SaveUser) => {
  await checkUsernameConflict(input.username);

  const user = new User();
  user.username = input.username;
  user.password = await hashPassword(input.password);
  user.role = input.role as Role;
  user.deposit = DEFAULT_DEPOSIT;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...savedUser } = await (await getDb()).getRepository<User>('User').save(user);

  return savedUser as User;
};

export const getUserById = async (id: number) => {
  const user = await (await getDb()).getRepository<User>('User').findOne({ where: { id } });
  if (!user) {
    throw new NotFoundError(`User ${id} not found`);
  }

  return user;
};

export const updateUser = async (input: SaveUser, user: User) => {
  if (user.username !== input.username) {
    await checkUsernameConflict(input.username);
  }

  user.username = input.username;
  user.password = await hashPassword(input.password);
  user.role = input.role as Role;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...updatedUser } = await (await getDb()).getRepository<User>('User').save(user);

  return updatedUser as User;
};

export const deleteUser = async (user: User) => {
  const deleteResult = await (await getDb()).getRepository<User>('User').delete(user.id);
  if (!deleteResult.affected) {
    throw new Error(`User ${user.id} not deleted`);
  }

  return deleteResult;
};

export const deposit = async (input: Deposit, user: User) => {
  user.deposit += input.cents;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...updatedUser } = await (await getDb()).getRepository<User>('User').save(user);

  return updatedUser as User;
};

const chunkChange = (cents: number) => {
  const { chunks } = ALLOWED_DEPOSIT_VALUES.sort((value1, value2) => value2 - value1).reduce(
    (change: ChunkResult, allowedDepositValue) => {
      if (!change.remainder) {
        return change;
      }

      const { chunks, remainder } = chunk(change.remainder, allowedDepositValue);

      return { chunks: [...change.chunks, ...chunks], remainder };
    },
    { chunks: [], remainder: cents },
  );

  return chunks;
};

export const buy = async (input: Buy, user: User) => {
  const existingProduct = await getProductById(input.productId);
  if (existingProduct.amountAvailable < input.amount) {
    throw new ConflictError(`Only ${existingProduct.amountAvailable} products left`);
  }

  const total = existingProduct.cost * input.amount;
  const change = user.deposit - total;
  if (change < 0) {
    throw new ConflictError(`You have to deposit ${change * -1} more cents to be able to buy this product`);
  }

  const db = await getDb();

  user.deposit = 0;
  await db.getRepository<User>('User').save(user);

  existingProduct.amountAvailable -= input.amount;
  const updatedProduct = await db.getRepository<Product>('Product').save(existingProduct);

  return {
    total,
    products: new Array(input.amount).fill(updatedProduct) as Product[],
    change: chunkChange(change),
  };
};

export const reset = async (user: User) => {
  user.deposit = DEFAULT_DEPOSIT;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...updatedUser } = await (await getDb()).getRepository<User>('User').save(user);

  return updatedUser as User;
};

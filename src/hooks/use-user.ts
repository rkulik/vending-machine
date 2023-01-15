import { User } from '@vending-machine/domains/user/entity';
import { useProducts } from '@vending-machine/hooks/use-products';
import { Buy, Deposit, Login, SaveUser } from '@vending-machine/schemas';
import { callApi, fetcher } from '@vending-machine/utils/call-api';
import useSWR from 'swr';

export const useUser = (fetchUser = true) => {
  const { mutate: mutateProducts } = useProducts(fetchUser);
  const { data, error, mutate } = useSWR<User>(fetchUser ? '/api/users/me' : null, fetcher);

  const loginUser = async (values: Login) => {
    const user = await callApi<User>('/api/auth/login', values);
    mutate();

    return user;
  };

  const logoutUser = async () => {
    await callApi('/api/auth/logout');
    mutate();
  };

  const logoutAll = async () => {
    await callApi('/api/auth/logout/all');
    mutate();
  };

  const registerUser = async (values: SaveUser) => {
    const user = await callApi<User>('/api/auth/register', values);
    mutate();

    return user;
  };

  const updateUser = async (values: SaveUser) => {
    const user = await callApi<User>('/api/users/me', values, 'PATCH');
    mutate();

    return user;
  };

  const deposit = async (values: Deposit) => {
    const user = await callApi<User>('/api/deposit', values);
    mutate();

    return user;
  };

  const resetDeposit = async () => {
    const user = await callApi<User>('/api/reset');
    mutate();

    return user;
  };

  const buyProduct = async (values: Buy) => {
    await callApi('/api/buy', values);
    mutate();
    mutateProducts();
  };

  const deleteUser = async () => {
    await callApi('/api/users/me', {}, 'DELETE');
    mutate();
  };

  return {
    user: data,
    loading: !!fetchUser && !data && !error,
    error,
    mutate,
    loginUser,
    logoutUser,
    logoutAll,
    registerUser,
    updateUser,
    deposit,
    resetDeposit,
    buyProduct,
    deleteUser,
  };
};

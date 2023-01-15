import { Product } from '@vending-machine/domains/product/entity';
import { fetcher } from '@vending-machine/utils/call-api';
import useSWR from 'swr';

export const useProducts = (fetchProducts = true) => {
  const { data, error, mutate } = useSWR<Product[]>(fetchProducts ? '/api/products' : null, fetcher);

  return {
    products: data ?? [],
    loading: !!fetchProducts && !data && !error,
    error,
    mutate,
  };
};

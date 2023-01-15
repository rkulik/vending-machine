import { Product } from '@vending-machine/domains/product/entity';
import { useProducts } from '@vending-machine/hooks/use-products';
import { useUser } from '@vending-machine/hooks/use-user';
import { SaveProduct } from '@vending-machine/schemas';
import { callApi, fetcher } from '@vending-machine/utils/call-api';
import useSWR from 'swr';

export const useProduct = (id?: number) => {
  const { mutate: mutateProducts } = useProducts();
  const { mutate: mutateUser } = useUser();
  const { data, error, mutate } = useSWR<Product>(id ? `/api/products/${id}` : null, fetcher);

  const createProduct = async (values: SaveProduct) => {
    const product = await callApi<Product>('/api/products', values);
    mutate();
    mutateProducts();
    mutateUser();

    return product;
  };

  const updateProduct = async (product: Product, values: SaveProduct) => {
    const updatedProduct = await callApi<Product>(`/api/products/${product.id}`, values, 'PATCH');
    mutate();
    mutateProducts();
    mutateUser();

    return updatedProduct;
  };

  const deleteProduct = async (product: Product) => {
    await callApi(`/api/products/${product.id}`, {}, 'DELETE');
    mutate();
    mutateProducts();
    mutateUser();
  };

  return {
    product: data,
    loading: !!id && !data && !error,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};

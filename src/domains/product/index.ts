import { Product } from '@vending-machine/domains/product/entity';
import { User } from '@vending-machine/domains/user/entity';
import { NotFoundError } from '@vending-machine/errors/not-found-error';
import { SaveProduct } from '@vending-machine/schemas';
import { getDb } from '@vending-machine/services/database';

export const getProducts = async () => (await getDb()).getRepository<Product>('Product').find();

export const createProduct = async (input: SaveProduct, user: User) => {
  const product = new Product();
  product.productName = input.productName;
  product.cost = input.cost;
  product.amountAvailable = input.amountAvailable;
  product.seller = user;

  return (await getDb()).getRepository<Product>('Product').save(product);
};

export const getProductById = async (id: number) => {
  const product = await (await getDb()).getRepository<Product>('Product').findOne({ where: { id } });
  if (!product) {
    throw new NotFoundError(`Product ${id} not found`);
  }

  return product;
};

export const updateProduct = async (input: SaveProduct & { id: number }) => {
  const existingProduct = await getProductById(input.id);
  existingProduct.productName = input.productName;
  existingProduct.cost = input.cost;
  existingProduct.amountAvailable = input.amountAvailable;

  return (await getDb()).getRepository<Product>('Product').save(existingProduct);
};

export const deleteProduct = async (id: number) => {
  const existingProduct = await getProductById(id);
  const deleteResult = await (await getDb()).getRepository<Product>('Product').delete(existingProduct.id);
  if (!deleteResult.affected) {
    throw new Error(`Product ${id} not deleted`);
  }

  return deleteResult;
};

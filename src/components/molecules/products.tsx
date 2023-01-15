import { Button } from '@vending-machine/components/atoms/button';
import { Space } from '@vending-machine/components/atoms/space';
import { BuyForm } from '@vending-machine/components/molecules/form/buy';
import { Product } from '@vending-machine/components/molecules/product';
import { Product as ProductEntity } from '@vending-machine/domains/product/entity';
import { User } from '@vending-machine/domains/user/entity';
import { FetchError } from '@vending-machine/errors/fetch-error';
import { useProduct } from '@vending-machine/hooks/use-product';
import { useSnackbar } from '@vending-machine/hooks/use-snackbar';
import { Role } from '@vending-machine/types/user';
import { useRouter } from 'next/router';
import { Fragment } from 'react';

const Separator = () => (
  <>
    <Space value={16} />
    <hr />
    <Space value={16} />
  </>
);

type BuyerActionProps = {
  user: User;
  product: ProductEntity;
};

const BuyerAction = (props: BuyerActionProps) => {
  const { user, product } = props;

  return <BuyForm user={user} product={product} />;
};

type SellerActionProps = {
  product: ProductEntity;
};

const SellerAction = (props: SellerActionProps) => {
  const { product } = props;
  const { deleteProduct } = useProduct();
  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  const handleDelete = async (product: ProductEntity) => {
    if (!confirm('Delete product?')) {
      return;
    }

    try {
      await deleteProduct(product);
      showSnackbar('Product deleted', { status: 'success' });
    } catch (error) {
      showSnackbar((error as FetchError).info.message, { status: 'error' });
    }
  };

  return (
    <>
      <Button variant="text" onClick={() => handleDelete(product)}>
        Delete
      </Button>
      &nbsp;
      <Button onClick={() => router.push(`/products/${product.id}`)}>Edit</Button>
    </>
  );
};

type ProductsProps = {
  user: User;
  products: ProductEntity[];
};

export const Products = (props: ProductsProps) => {
  const { user, products } = props;

  return (
    <>
      {products.map((product, index) => {
        const buyable = user.role === Role.BUYER && user.deposit >= product.cost && !!product.amountAvailable;
        const editable = user.role === Role.SELLER && user.productIds.includes(product.id);
        const action = buyable ? (
          <BuyerAction user={user} product={product} />
        ) : editable ? (
          <SellerAction product={product} />
        ) : undefined;

        return (
          <Fragment key={product.id}>
            {index !== 0 && <Separator />}
            <Product product={product} action={action} />
          </Fragment>
        );
      })}
    </>
  );
};

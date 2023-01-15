import { Card } from '@vending-machine/components/atoms/card';
import { ProductForm } from '@vending-machine/components/molecules/form/product';
import { ProtectedLayout } from '@vending-machine/components/organisms/layout/protected';
import { useProduct } from '@vending-machine/hooks/use-product';
import { useUser } from '@vending-machine/hooks/use-user';
import { Role } from '@vending-machine/types/user';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';

const Product = () => {
  const router = useRouter();
  const { id } = router.query as { id?: string };
  const { product } = useProduct(id ? parseInt(id) : undefined);
  const { user } = useUser();
  const isSeller = user?.role === Role.SELLER;

  if (!user || !product) {
    return null;
  }

  if (!isSeller && !user.productIds.includes(product.id)) {
    return router.push('/');
  }

  return (
    <Card>
      <ProductForm product={product} />
    </Card>
  );
};

Product.getLayout = (page: ReactElement) => <ProtectedLayout>{page}</ProtectedLayout>;

// eslint-disable-next-line import/no-default-export
export default Product;

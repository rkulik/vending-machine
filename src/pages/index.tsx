import { Card } from '@vending-machine/components/atoms/card';
import { Space } from '@vending-machine/components/atoms/space';
import { DepositForm } from '@vending-machine/components/molecules/form/deposit';
import { ProductForm } from '@vending-machine/components/molecules/form/product';
import { Products } from '@vending-machine/components/molecules/products';
import { ProtectedLayout } from '@vending-machine/components/organisms/layout/protected';
import { Product } from '@vending-machine/domains/product/entity';
import { User } from '@vending-machine/domains/user/entity';
import { useProducts } from '@vending-machine/hooks/use-products';
import { useUser } from '@vending-machine/hooks/use-user';
import { Role } from '@vending-machine/types/user';
import { ReactElement } from 'react';

type DepositCardProps = {
  user: User;
};

const DepositCard = (props: DepositCardProps) => (
  <Card>
    <h2>Deposit</h2>
    <Space value={24} />
    <DepositForm user={props.user} />
  </Card>
);

const CreateProductCard = () => (
  <Card>
    <h2>Add Product</h2>
    <Space value={24} />
    <ProductForm />
  </Card>
);

type ProductsCardProps = {
  user: User;
  products: Product[];
};

const ProductsCard = (props: ProductsCardProps) => {
  const { user, products } = props;

  return (
    <Card>
      <h2>Products</h2>
      <Space value={24} />
      <Products user={user} products={products} />
    </Card>
  );
};

const VendingMachine = () => {
  const { user } = useUser();
  const isBuyer = user?.role === Role.BUYER;
  const { products } = useProducts();

  if (!user) {
    return null;
  }

  return (
    <>
      {isBuyer && <DepositCard user={user} />}
      {!isBuyer && <CreateProductCard />}
      <Space value={24} />
      {!!products.length && <ProductsCard user={user} products={products} />}
    </>
  );
};

VendingMachine.getLayout = (page: ReactElement) => <ProtectedLayout>{page}</ProtectedLayout>;

// eslint-disable-next-line import/no-default-export
export default VendingMachine;

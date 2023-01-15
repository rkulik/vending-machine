import { Product as ProductEntity } from '@vending-machine/domains/product/entity';
import { convertToEuro } from '@vending-machine/utils/currency';
import { ReactNode } from 'react';
import styles from './style.module.scss';

type ProductProps = {
  product: ProductEntity;
  action: ReactNode;
};

export const Product = (props: ProductProps) => {
  const { product, action } = props;

  return (
    <div className={styles.product}>
      <div>
        <div>Product name: {product.productName}</div>
        <div>Cost: {convertToEuro(product.cost)}</div>
        <div>Amount available: {product.amountAvailable}</div>
      </div>
      <div className={styles.action}>{action}</div>
    </div>
  );
};

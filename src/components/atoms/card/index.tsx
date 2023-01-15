import { ReactNode } from 'react';
import styles from './style.module.scss';

type CardProps = {
  children: ReactNode;
};

export const Card = (props: CardProps) => <div className={styles.card}>{props.children}</div>;

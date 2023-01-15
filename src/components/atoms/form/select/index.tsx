import classNames from 'classnames';
import { SelectHTMLAttributes } from 'react';
import styles from './style.module.scss';

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { status?: 'error' };

export const Select = (props: SelectProps) => {
  const { className, status, ...restOfProps } = props;

  return (
    <select className={classNames(styles.select, { [styles.error]: status === 'error' }, className)} {...restOfProps} />
  );
};

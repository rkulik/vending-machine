import classNames from 'classnames';
import { InputHTMLAttributes } from 'react';
import styles from './style.module.scss';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & { status?: 'error' };

export const Input = (props: InputProps) => {
  const { status, className, ...restOfProps } = props;

  return (
    <input className={classNames(styles.input, { [styles.error]: status === 'error' }, className)} {...restOfProps} />
  );
};

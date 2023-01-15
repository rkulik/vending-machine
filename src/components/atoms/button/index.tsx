import classNames from 'classnames';
import { ButtonHTMLAttributes } from 'react';
import styles from './style.module.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'text' };

export const Button = (props: ButtonProps) => {
  const { variant, className, children, ...restOfProps } = props;

  return (
    <button className={classNames(styles.button, { [styles.text]: variant === 'text' }, className)} {...restOfProps}>
      {children}
    </button>
  );
};

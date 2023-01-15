import classNames from 'classnames';
import { LabelHTMLAttributes } from 'react';
import styles from './style.module.scss';

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export const Label = (props: LabelProps) => {
  const { className, ...restOfProps } = props;

  return <label className={classNames(styles.label, className)} {...restOfProps} />;
};

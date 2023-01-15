import classNames from 'classnames';
import { ReactNode } from 'react';
import styles from './style.module.scss';

type MessageProps = {
  status: 'success' | 'error';
  children: ReactNode;
};

export const Message = (props: MessageProps) => {
  const { status, children } = props;

  return (
    <div className={classNames({ [styles.success]: status === 'success', [styles.error]: status === 'error' })}>
      {children}
    </div>
  );
};

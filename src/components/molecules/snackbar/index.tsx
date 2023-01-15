import classNames from 'classnames';
import { ReactNode, useEffect } from 'react';
import styles from './style.module.scss';

export type SnackbarProps = {
  children: ReactNode;
  status?: 'success' | 'error' | 'warn';
  action?: ReactNode;
  autoHideDuration?: number;
  onClose?: () => void;
};

export const Snackbar = (props: SnackbarProps) => {
  const { children, status, action, onClose, autoHideDuration = 3000 } = props;

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  useEffect(() => {
    const timeout = setTimeout(handleClose, autoHideDuration);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoHideDuration]);

  return (
    <div className={styles.bar}>
      <div
        className={classNames(styles.snack, {
          [styles.success]: status === 'success',
          [styles.warn]: status === 'warn',
          [styles.error]: status === 'error',
        })}>
        <div>{children}</div>
        <div className={styles.action}>{action}</div>
      </div>
    </div>
  );
};

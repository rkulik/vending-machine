import { Snackbar, SnackbarProps } from '@vending-machine/components/molecules/snackbar';
import { createContext, forwardRef, ReactNode, useImperativeHandle, useState } from 'react';
import { createPortal } from 'react-dom';

type SnackOptions = Omit<SnackbarProps, 'children'>;

type Snack = {
  message: string;
  options?: SnackOptions;
};

export type ProviderContext = {
  showSnackbar: (message: string, options?: SnackOptions) => void;
  closeSnackbar: () => void;
};

export const SnackbarContext = createContext<ProviderContext>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  showSnackbar: (message: string, options?: SnackOptions) => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  closeSnackbar: () => {},
});

type SnackbarProviderProps = {
  children: ReactNode;
  domRoot?: HTMLElement;
  action?: ReactNode;
};

type SnackbarProviderHandle = {
  closeSnackbar: () => void;
};

export const SnackbarProvider = forwardRef<SnackbarProviderHandle, SnackbarProviderProps>((props, ref) => {
  const { children, domRoot, action } = props;
  const [snack, setSnack] = useState<Snack>();
  const showSnackbar = (message: string, options?: SnackOptions) => setSnack({ message, options });
  const closeSnackbar = () => setSnack(undefined);

  useImperativeHandle(ref, () => ({ closeSnackbar }));

  const snackbar = snack && (
    <Snackbar onClose={closeSnackbar} action={action} {...snack.options}>
      {snack.message}
    </Snackbar>
  );

  return (
    <SnackbarContext.Provider value={{ showSnackbar, closeSnackbar }}>
      {children}
      {domRoot ? createPortal(snackbar, domRoot) : snackbar}
    </SnackbarContext.Provider>
  );
});

SnackbarProvider.displayName = 'SnackbarProvider';

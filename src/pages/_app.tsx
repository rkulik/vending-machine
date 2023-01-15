import { Button } from '@vending-machine/components/atoms/button';
import { SnackbarProvider } from '@vending-machine/contexts/snackbar-provider';
import '@vending-machine/styles/app.scss';
import { isBrowser } from '@vending-machine/utils/is-browser';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { ElementRef, ReactElement, ReactNode, useRef } from 'react';

type NextPageWithLayout = NextPage & { getLayout?: (page: ReactElement) => ReactNode };
type AppPropsWithLayout = AppProps & { Component: NextPageWithLayout };

const App = (props: AppPropsWithLayout) => {
  const { Component, pageProps } = props;
  const getLayout = Component.getLayout || (page => page);
  const snackbarRoot = isBrowser() ? document.getElementById('snackbar-root') ?? undefined : undefined;
  type SnackbarProviderHandle = ElementRef<typeof SnackbarProvider>;
  const snackbarProviderRef = useRef<SnackbarProviderHandle>(null);

  return (
    <SnackbarProvider
      ref={snackbarProviderRef}
      domRoot={snackbarRoot}
      action={
        <Button
          variant="text"
          onClick={() => {
            snackbarProviderRef.current?.closeSnackbar();
          }}>
          close
        </Button>
      }>
      {getLayout(<Component {...pageProps} />)}
    </SnackbarProvider>
  );
};

// eslint-disable-next-line import/no-default-export
export default App;

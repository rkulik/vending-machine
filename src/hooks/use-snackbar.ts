import { ProviderContext, SnackbarContext } from '@vending-machine/contexts/snackbar-provider';
import { useContext } from 'react';

export const useSnackbar = (): ProviderContext => useContext(SnackbarContext);

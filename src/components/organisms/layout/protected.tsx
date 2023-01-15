import { Navigation } from '@vending-machine/components/molecules/navigation';
import { ReactNode } from 'react';

type ProtectedLayoutProps = {
  children: ReactNode;
};

export const ProtectedLayout = (props: ProtectedLayoutProps) => (
  <div>
    <Navigation />
    {props.children}
  </div>
);

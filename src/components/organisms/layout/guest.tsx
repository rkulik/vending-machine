import { ReactNode } from 'react';

type GuestLayoutProps = {
  children: ReactNode;
};

export const GuestLayout = (props: GuestLayoutProps) => <div>{props.children}</div>;

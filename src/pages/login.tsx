import { Card } from '@vending-machine/components/atoms/card';
import { Space } from '@vending-machine/components/atoms/space';
import { LoginForm } from '@vending-machine/components/molecules/form/login';
import { GuestLayout } from '@vending-machine/components/organisms/layout/guest';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';

const Login = () => {
  const router = useRouter();

  return (
    <Card>
      <h1>Login</h1>
      <Space value={32} />
      <LoginForm onSubmit={() => router.push('/')} />
    </Card>
  );
};

Login.getLayout = (page: ReactElement) => <GuestLayout>{page}</GuestLayout>;

// eslint-disable-next-line import/no-default-export
export default Login;

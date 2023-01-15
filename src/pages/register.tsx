import { Card } from '@vending-machine/components/atoms/card';
import { Space } from '@vending-machine/components/atoms/space';
import { UserForm } from '@vending-machine/components/molecules/form/user';
import { GuestLayout } from '@vending-machine/components/organisms/layout/guest';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';

const Register = () => {
  const router = useRouter();

  return (
    <Card>
      <h1>Register</h1>
      <Space value={32} />
      <UserForm onSubmit={() => router.push('/')} />
    </Card>
  );
};

Register.getLayout = (page: ReactElement) => <GuestLayout>{page}</GuestLayout>;

// eslint-disable-next-line import/no-default-export
export default Register;

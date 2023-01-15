import { Card } from '@vending-machine/components/atoms/card';
import { Space } from '@vending-machine/components/atoms/space';
import { UserForm } from '@vending-machine/components/molecules/form/user';
import { ProtectedLayout } from '@vending-machine/components/organisms/layout/protected';
import { useUser } from '@vending-machine/hooks/use-user';
import { ReactElement } from 'react';

const User = () => {
  const { user } = useUser();
  if (!user) {
    return null;
  }

  return (
    <Card>
      <h2>User</h2>
      <Space value={24} />
      <UserForm user={user} />
    </Card>
  );
};

User.getLayout = (page: ReactElement) => <ProtectedLayout>{page}</ProtectedLayout>;

// eslint-disable-next-line import/no-default-export
export default User;

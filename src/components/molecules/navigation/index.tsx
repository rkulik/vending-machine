import { Button } from '@vending-machine/components/atoms/button';
import { useUser } from '@vending-machine/hooks/use-user';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './style.module.scss';

export const Navigation = () => {
  const { logoutUser } = useUser(false);
  const router = useRouter();

  return (
    <ul className={styles.navigation}>
      <li>
        <Link href="/">Vending Machine</Link>
      </li>
      <li>
        <Link href="/user">User</Link>
      </li>
      <li>
        <Button
          onClick={async () => {
            await logoutUser();
            router.push('/login');
          }}>
          Logout
        </Button>
      </li>
    </ul>
  );
};

import { redirect } from 'next/navigation';

import { getCurrent } from '@/features/auth/actions';
import { UserButton } from '@/features/auth/components/user-button';

const HomePage = async () => {
  const user = await getCurrent();

  if (!user) redirect('/sign-in');

  return (
    <div>
      <UserButton />
    </div>
  );
};

export default HomePage;

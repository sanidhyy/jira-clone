import { redirect } from 'next/navigation';

import { getCurrent } from '@/features/auth/actions';

const HomePage = async () => {
  const user = await getCurrent();

  if (!user) redirect('/sign-in');

  return <div>Home Page</div>;
};

export default HomePage;

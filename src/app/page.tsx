'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { useCurrent } from '@/features/auth/api/use-current';
import { useLogout } from '@/features/auth/api/use-logout';

const HomePage = () => {
  const router = useRouter();
  const { data, isLoading } = useCurrent();
  const { mutate: logout } = useLogout();

  useEffect(() => {
    if (!data && !isLoading) {
      router.push('/sign-in');
    }
  }, [data]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!data) return null;

  return (
    <main>
      <p>Only visible to logged in users.</p>
      <Button onClick={() => logout()}>Log out</Button>
    </main>
  );
};

export default HomePage;

'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useCurrent } from '@/features/auth/api/use-current';
import { UserButton } from '@/features/auth/components/user-button';

const HomePage = () => {
  const router = useRouter();
  const { data, isLoading } = useCurrent();

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
    <div>
      <UserButton />
    </div>
  );
};

export default HomePage;

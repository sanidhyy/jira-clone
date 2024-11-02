import { useParams } from 'next/navigation';

export const useInviteCode = () => {
  const params = useParams();

  return params.inviteCode as string;
};

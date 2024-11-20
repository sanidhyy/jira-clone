import { useParams } from 'next/navigation';

export const useProjectId = () => {
  const params = useParams();

  return params.projectId as string;
};

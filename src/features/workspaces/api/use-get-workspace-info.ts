import { useQuery } from '@tanstack/react-query';

import { client } from '@/lib/hono';

interface useGetWorkspaceInfoProps {
  workspaceId: string;
}

export const useGetWorkspaceInfo = ({ workspaceId }: useGetWorkspaceInfoProps) => {
  const query = useQuery({
    queryKey: ['workspace-info', workspaceId],
    queryFn: async () => {
      const response = await client.api.workspaces[':workspaceId']['info'].$get({
        param: { workspaceId },
      });

      if (!response.ok) throw new Error('Failed to fetch workspace info.');

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};

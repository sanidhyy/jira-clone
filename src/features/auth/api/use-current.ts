import { useQuery } from '@tanstack/react-query';

import { client } from '@/lib/hono';

export const useCurrent = () => {
  const query = useQuery({
    queryKey: ['current'],
    queryFn: async () => {
      const response = await client.api.auth.current.$get();

      if (!response.ok) return null;

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<(typeof client.api.projects)['$post'], 200>;
type RequestType = InferRequestType<(typeof client.api.projects)['$post']>;

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.projects['$post']({ form });

      if (!response.ok) throw new Error('Failed to create project.');

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success('Project created.');

      queryClient.invalidateQueries({
        queryKey: ['projects', data.workspaceId],
        exact: true,
      });
    },
    onError: (error) => {
      console.error('[CREATE_PROJECT]: ', error);

      toast.error('Failed to create project.');
    },
  });

  return mutation;
};

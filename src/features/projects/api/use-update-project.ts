import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<(typeof client.api.projects)[':projectId']['$patch'], 200>;
type RequestType = InferRequestType<(typeof client.api.projects)[':projectId']['$patch']>;

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const response = await client.api.projects[':projectId']['$patch']({ form, param });

      if (!response.ok) throw new Error('Failed to update project.');

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success('Project updated.');

      queryClient.invalidateQueries({
        queryKey: ['projects', data.workspaceId],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ['project', data.$id],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ['tasks', data.workspaceId, data.$id],
        exact: false,
      });
    },
    onError: (error) => {
      console.error('[UPDATE_PROJECT]: ', error);

      toast.error('Failed to update project.');
    },
  });

  return mutation;
};

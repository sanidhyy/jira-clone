import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<(typeof client.api.projects)[':projectId']['$delete'], 200>;
type RequestType = InferRequestType<(typeof client.api.projects)[':projectId']['$delete']>;

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.projects[':projectId']['$delete']({ param });

      if (!response.ok) throw new Error('Failed to delete project.');

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success('Project deleted.');

      queryClient.invalidateQueries({
        queryKey: ['projects', data.workspaceId],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ['project', data.$id],
        exact: true,
      });
    },
    onError: (error) => {
      console.error('[DELETE_PROJECT]: ', error);

      toast.error('Failed to delete project.');
    },
  });

  return mutation;
};

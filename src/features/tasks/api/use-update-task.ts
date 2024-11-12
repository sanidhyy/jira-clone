import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<(typeof client.api.tasks)[':taskId']['$patch'], 200>;
type RequestType = InferRequestType<(typeof client.api.tasks)[':taskId']['$patch']>;

export const useUpdateTask = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.tasks[':taskId']['$patch']({ json, param });

      if (!response.ok) throw new Error('Failed to update task.');

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success('Task updated.');

      queryClient.invalidateQueries({
        queryKey: ['tasks', data.workspaceId],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ['task', data.$id],
        exact: false,
      });
      router.refresh();
    },
    onError: (error) => {
      console.error('[UPDATE_TASK]: ', error);

      toast.error('Failed to update task.');
    },
  });

  return mutation;
};

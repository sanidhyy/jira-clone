import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<(typeof client.api.workspaces)['$post']>;
type RequestType = InferRequestType<(typeof client.api.workspaces)['$post']>;

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.workspaces['$post']({ json });

      return await response.json();
    },
    onSuccess: () => {
      toast.success('Workspace created.');

      queryClient.invalidateQueries({
        queryKey: ['workspaces'],
      });
    },
    onError: (error) => {
      console.error('[CREATE_WORKSPACE]: ', error);

      toast.error('Failed to create workspace.');
    },
  });

  return mutation;
};

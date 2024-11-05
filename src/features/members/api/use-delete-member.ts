import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<(typeof client.api.members)[':memberId']['$delete'], 200>;
type RequestType = InferRequestType<(typeof client.api.members)[':memberId']['$delete']>;

export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.members[':memberId']['$delete']({ param });

      if (!response.ok) throw new Error('Failed to delete member.');

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success('Member deleted.');

      queryClient.invalidateQueries({
        queryKey: ['members', data.workspaceId],
        exact: true,
      });
    },
    onError: (error) => {
      console.error('[DELETE_MEMBER]: ', error);

      toast.error('Failed to delete member.');
    },
  });

  return mutation;
};

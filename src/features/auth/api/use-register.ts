import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<(typeof client.api.auth.register)['$post']>;
type RequestType = InferRequestType<(typeof client.api.auth.register)['$post']>;

export const useRegister = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.register['$post']({ json });

      if (!response.ok) throw new Error('Failed to register!');

      return await response.json();
    },
    onSuccess: () => {
      router.refresh();

      queryClient.invalidateQueries({
        queryKey: ['current'],
      });
    },
    onError: (error) => {
      console.error('[REGISTER]: ', error);

      toast.error('Failed to register!');
    },
  });

  return mutation;
};

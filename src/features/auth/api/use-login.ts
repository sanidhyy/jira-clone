import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<(typeof client.api.auth.login)['$post']>;
type RequestType = InferRequestType<(typeof client.api.auth.login)['$post']>;

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.login['$post']({ json });

      if (!response.ok) throw new Error('Email or Password is incorrect!');

      return await response.json();
    },
    onSuccess: () => {
      router.refresh();

      queryClient.invalidateQueries({
        queryKey: ['current'],
      });
    },
    onError: () => {
      toast.error('Email or Password is incorrect!');
    },
  });

  return mutation;
};

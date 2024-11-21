'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { OAuthProvider } from 'node-appwrite';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'sonner';
import { z } from 'zod';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useLogin } from '@/features/auth/api/use-login';
import { signInFormSchema } from '@/features/auth/schema';
import { onOAuth } from '@/lib/oauth';

export const SignInCard = () => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { mutate: login, isPending: isLoggingIn } = useLogin();

  const signInForm = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof signInFormSchema>) => {
    login(
      {
        json: values,
      },
      {
        onSuccess: () => {
          signInForm.reset();
        },
        onError: () => {
          signInForm.resetField('password');
        },
      },
    );
  };

  const handleOAuth = (provider: OAuthProvider.Github | OAuthProvider.Google) => {
    setIsRedirecting(true);

    onOAuth(provider)
      .catch((error) => {
        console.error(error);
        toast.error('Something went wrong.');
      })
      .finally(() => setIsRedirecting(false));
  };

  const isPending = isLoggingIn || isRedirecting;

  return (
    <Card className="size-full border-none shadow-none md:w-[487px]">
      <CardHeader className="flex items-center justify-center p-7 text-center">
        <CardTitle className="text-2xl">Welcome back!</CardTitle>
      </CardHeader>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7">
        <Form {...signInForm}>
          <form onSubmit={signInForm.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              disabled={isPending}
              name="email"
              control={signInForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} type="email" placeholder="Email address" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              disabled={isPending}
              name="password"
              control={signInForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} type="password" placeholder="Password" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending} size="lg" className="w-full">
              Login
            </Button>
          </form>
        </Form>
      </CardContent>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="flex flex-col gap-y-4 p-7">
        <Button onClick={() => handleOAuth(OAuthProvider.Google)} disabled={isPending} variant="secondary" size="lg" className="w-full">
          <FcGoogle className="mr-2 size-5" /> Continue with Google
        </Button>

        <Button onClick={() => handleOAuth(OAuthProvider.Github)} disabled={isPending} variant="secondary" size="lg" className="w-full">
          <FaGithub className="mr-2 size-5" /> Continue with GitHub
        </Button>
      </CardContent>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="flex items-center justify-center p-7">
        <p>
          Don&apos;t have an account?{' '}
          <Link href="/sign-up">
            <span className="text-blue-700">Register</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

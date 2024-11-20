'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, CopyIcon, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { DottedSeparator } from '@/components/dotted-separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useDeleteWorkspace } from '@/features/workspaces/api/use-delete-workspace';
import { useResetInviteCode } from '@/features/workspaces/api/use-reset-invite-code';
import { useUpdateWorkspace } from '@/features/workspaces/api/use-update-workspace';
import { updateWorkspaceSchema } from '@/features/workspaces/schema';
import type { Workspace } from '@/features/workspaces/types';
import { useConfirm } from '@/hooks/use-confirm';
import { cn } from '@/lib/utils';

interface EditWorkspaceFormProps {
  onCancel?: () => void;
  initialValues: Workspace;
}

export const EditWorkspaceForm = ({ onCancel, initialValues }: EditWorkspaceFormProps) => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [DeleteDialog, confirmDelete] = useConfirm('Delete workspace', 'This action cannot be undone.', 'destructive');
  const [ResetDialog, confirmReset] = useConfirm(
    'Reset invite link',
    'This action will invalidate the current invite link.',
    'destructive',
  );

  const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } = useUpdateWorkspace();
  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } = useDeleteWorkspace();
  const { mutate: resetInviteCode, isPending: isResettingInviteCode } = useResetInviteCode();

  const updateWorkspaceForm = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? '',
    },
  });

  const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : '',
    };

    updateWorkspace({
      form: finalValues,
      param: { workspaceId: initialValues.$id },
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB in bytes;
    const file = e.target.files?.[0];

    if (file) {
      if (file.size > MAX_FILE_SIZE) return toast.error('Image size cannot exceed 1 MB.');

      updateWorkspaceForm.setValue('image', file);
    }
  };

  const handleDelete = async () => {
    const ok = await confirmDelete();

    if (!ok) return;

    deleteWorkspace(
      {
        param: { workspaceId: initialValues.$id },
      },
      {
        onSuccess: () => {
          window.location.href = '/';
        },
      },
    );
  };

  const handleResetInviteCode = async () => {
    const ok = await confirmReset();

    if (!ok) return;

    resetInviteCode({
      param: { workspaceId: initialValues.$id },
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fullInviteLink).then(() => toast.success('Invite link copied to clipboard.'));
  };

  const fullInviteLink = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`;
  const isPending = isUpdatingWorkspace || isDeletingWorkspace || isResettingInviteCode;

  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />
      <ResetDialog />

      <Card className="size-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 space-y-0 p-7">
          <Button
            size="sm"
            variant="secondary"
            onClick={onCancel ? onCancel : () => router.push(`/workspaces/${initialValues.$id}`)}
            className="gap-x-1"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>

          <CardTitle className="text-xl font-bold">{initialValues.name}</CardTitle>
        </CardHeader>

        <div className="px-7">
          <DottedSeparator />
        </div>

        <CardContent className="p-7">
          <Form {...updateWorkspaceForm}>
            <form onSubmit={updateWorkspaceForm.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-y-4">
                <FormField
                  disabled={isPending}
                  control={updateWorkspaceForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace Name</FormLabel>

                      <FormControl>
                        <Input {...field} type="text" placeholder="Enter workspace name" />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  disabled={isPending}
                  control={updateWorkspaceForm.control}
                  name="image"
                  render={({ field }) => (
                    <div className="flex flex-col gap-y-2">
                      <div className="flex items-center gap-x-5">
                        {field.value ? (
                          <div className="relative size-[72px] overflow-hidden rounded-md">
                            <Image
                              src={field.value instanceof File ? URL.createObjectURL(field.value) : field.value}
                              alt="Workspace Logo"
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <Avatar className="size-[72px]">
                            <AvatarFallback>
                              <ImageIcon className="size-[36px] text-neutral-400" />
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <div className="flex flex-col">
                          <p className="text-sm">Workspace Icon</p>
                          <p className="text-xs text-muted-foreground">JPG, PNG, or JPEG, max 1MB</p>

                          <input
                            type="file"
                            className="hidden"
                            onChange={handleImageChange}
                            accept=".jpg, .png, .jpeg"
                            ref={inputRef}
                            disabled={isPending}
                          />

                          {field.value ? (
                            <Button
                              type="button"
                              disabled={isPending}
                              variant="destructive"
                              size="xs"
                              className="mt-2 w-fit"
                              onClick={() => {
                                field.onChange('');

                                if (inputRef.current) inputRef.current.value = '';
                              }}
                            >
                              Remove Image
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              disabled={isPending}
                              variant="tertiary"
                              size="xs"
                              className="mt-2 w-fit"
                              onClick={() => inputRef.current?.click()}
                            >
                              Upload Image
                            </Button>
                          )}
                        </div>
                      </div>

                      <FormMessage />
                    </div>
                  )}
                />
              </div>

              <DottedSeparator className="py-7" />

              <div className="flex items-center justify-between">
                <Button
                  disabled={isPending}
                  type="button"
                  size="lg"
                  variant="secondary"
                  onClick={onCancel}
                  className={cn(!onCancel && 'invisible')}
                >
                  Cancel
                </Button>

                <Button disabled={isPending} type="submit" size="lg">
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="size-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Invite Members</h3>

            <p className="text-sm text-muted-foreground">Use the invite link to add members to your workspace.</p>

            <div className="mt-4">
              <div className="flex items-center gap-x-2">
                <Input value={fullInviteLink} disabled className="disabled:cursor-default disabled:opacity-100" />

                <Button onClick={handleCopy} variant="secondary" className="size-12">
                  <CopyIcon className="size-5" />
                </Button>
              </div>
            </div>

            <DottedSeparator className="py-7" />

            <Button
              size="sm"
              variant="destructive"
              type="button"
              disabled={isPending}
              onClick={handleResetInviteCode}
              className="ml-auto mt-6 w-fit"
            >
              Reset invite link
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="size-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger Zone</h3>

            <p className="text-sm text-muted-foreground">Deleting a workspace is irreversible and will remove all associated data.</p>

            <DottedSeparator className="py-7" />

            <Button
              size="sm"
              variant="destructive"
              type="button"
              disabled={isPending}
              onClick={handleDelete}
              className="ml-auto mt-6 w-fit"
            >
              Delete Workspace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

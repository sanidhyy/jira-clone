import { ExternalLink, PencilIcon, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { PropsWithChildren } from 'react';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useDeleteTask } from '@/features/tasks/api/use-delete-task';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useConfirm } from '@/hooks/use-confirm';

interface TaskActionsProps {
  id: string;
  projectId: string;
}

export const TaskActions = ({ id, projectId, children }: PropsWithChildren<TaskActionsProps>) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [ConfirmDialog, confirm] = useConfirm('Delete task', 'This action cannot be undone.', 'destructive');

  const { mutate: deleteTask, isPending } = useDeleteTask();

  const onDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    deleteTask({ param: { taskId: id } });
  };

  const onOpenTask = () => {
    router.push(`/workspaces/${workspaceId}/tasks/${id}`);
  };

  const onOpenProject = () => {
    router.push(`/workspaces/${workspaceId}/projects/${projectId}`);
  };

  return (
    <div className="flex justify-end">
      <ConfirmDialog />

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild disabled={isPending}>
          {children}
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={onOpenTask} disabled={isPending} className="font-medium p-[10px]">
            <ExternalLink className="size-4 mr-2 stroke-2" />
            Task Details
          </DropdownMenuItem>

          <DropdownMenuItem onClick={onOpenProject} disabled={isPending} className="font-medium p-[10px]">
            <ExternalLink className="size-4 mr-2 stroke-2" />
            Open Project
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => {}} disabled={isPending} className="font-medium p-[10px]">
            <PencilIcon className="size-4 mr-2 stroke-2" />
            Edit Task
          </DropdownMenuItem>

          <DropdownMenuItem onClick={onDelete} disabled={isPending} className="text-amber-700 focus:text-amber-700 font-medium p-[10px]">
            <Trash className="size-4 mr-2 stroke-2" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

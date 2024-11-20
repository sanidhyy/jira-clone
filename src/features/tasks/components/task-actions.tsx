import { ExternalLink, PencilIcon, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { PropsWithChildren } from 'react';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useDeleteTask } from '@/features/tasks/api/use-delete-task';
import { useEditTaskModal } from '@/features/tasks/hooks/use-edit-task-modal';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useConfirm } from '@/hooks/use-confirm';

interface TaskActionsProps {
  id: string;
  projectId: string;
}

export const TaskActions = ({ id, projectId, children }: PropsWithChildren<TaskActionsProps>) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const { open } = useEditTaskModal();
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
          <DropdownMenuItem onClick={onOpenTask} disabled={isPending} className="p-[10px] font-medium">
            <ExternalLink className="mr-2 size-4 stroke-2" />
            Task Details
          </DropdownMenuItem>

          <DropdownMenuItem onClick={onOpenProject} disabled={isPending} className="p-[10px] font-medium">
            <ExternalLink className="mr-2 size-4 stroke-2" />
            Open Project
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => open(id)} disabled={isPending} className="p-[10px] font-medium">
            <PencilIcon className="mr-2 size-4 stroke-2" />
            Edit Task
          </DropdownMenuItem>

          <DropdownMenuItem onClick={onDelete} disabled={isPending} className="p-[10px] font-medium text-amber-700 focus:text-amber-700">
            <Trash className="mr-2 size-4 stroke-2" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

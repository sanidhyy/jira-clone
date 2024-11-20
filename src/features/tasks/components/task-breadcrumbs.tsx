import { ChevronRight, Trash } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { ProjectAvatar } from '@/features/projects/components/project-avatar';
import type { Project } from '@/features/projects/types';
import { useDeleteTask } from '@/features/tasks/api/use-delete-task';
import type { Task } from '@/features/tasks/types';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useConfirm } from '@/hooks/use-confirm';

interface TaskBreadcrumbsProps {
  project: Project;
  task: Task;
}

export const TaskBreadcrumbs = ({ project, task }: TaskBreadcrumbsProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [ConfirmDialog, confirm] = useConfirm('Delete task?', 'This action cannot be undone.', 'destructive');

  const { mutate: deleteTask, isPending } = useDeleteTask();

  const handleDeleteTask = async () => {
    const ok = await confirm();

    if (!ok) return;

    deleteTask(
      { param: { taskId: task.$id } },
      {
        onSuccess: () => {
          router.push(`/workspaces/${workspaceId}/tasks`);
        },
      },
    );
  };

  return (
    <div className="flex items-center gap-x-2">
      <ConfirmDialog />

      <ProjectAvatar name={project.name} image={project.imageUrl} className="size-6 lg:size-8" />

      <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
        <p className="text-sm font-semibold text-muted-foreground transition hover:opacity-75 lg:text-lg">{project.name}</p>
      </Link>

      <ChevronRight className="size-4 text-muted-foreground lg:size-5" />
      <p className="text-sm font-semibold lg:text-lg">{task.name}</p>

      <Button disabled={isPending} onClick={handleDeleteTask} className="ml-auto" variant="destructive" size="sm">
        <Trash className="size-4 lg:mr-2" />
        <span className="hidden lg:block">Delete task</span>
      </Button>
    </div>
  );
};

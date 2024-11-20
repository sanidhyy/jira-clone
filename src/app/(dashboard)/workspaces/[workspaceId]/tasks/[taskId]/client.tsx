'use client';

import { PageError } from '@/components/page-error';
import { PageLoader } from '@/components/page-loader';
import { useGetTask } from '@/features/tasks/api/use-get-task';
import { TaskBreadcrumbs } from '@/features/tasks/components/task-breadcrumbs';
import { useTaskId } from '@/features/tasks/hooks/use-task-id';

export const TaskIdClient = () => {
  const taskId = useTaskId();

  const { data: task, isLoading } = useGetTask({ taskId });

  if (isLoading) return <PageLoader />;

  if (!task) return <PageError message="Task not found." />;

  return (
    <div className="flex flex-col">
      <TaskBreadcrumbs project={task.project} task={task} />
    </div>
  );
};

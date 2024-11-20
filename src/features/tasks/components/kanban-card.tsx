import { MoreHorizontal } from 'lucide-react';

import { DottedSeparator } from '@/components/dotted-separator';
import { MemberAvatar } from '@/features/members/components/member-avatar';
import { ProjectAvatar } from '@/features/projects/components/project-avatar';
import type { Task } from '@/features/tasks/types';

import { TaskActions } from './task-actions';
import { TaskDate } from './task-date';

interface KanbanCardProps {
  task: Task;
}

export const KanbanCard = ({ task }: KanbanCardProps) => {
  return (
    <div className="mb-1.5 space-y-3 rounded bg-white p-2.5 shadow-sm">
      <div className="flex items-start justify-between gap-x-2">
        <p className="line-clamp-2 text-sm">{task.name}</p>

        <TaskActions id={task.$id} projectId={task.projectId}>
          <MoreHorizontal className="size-[18px] shrink-0 cursor-pointer stroke-1 text-neutral-700 transition hover:opacity-75" />
        </TaskActions>
      </div>

      <DottedSeparator />

      <div className="flex items-center gap-x-1.5">
        <MemberAvatar name={task.assignee.name} fallbackClassName="text-[10px]" />
        <div aria-hidden className="size-1 rounded-full bg-neutral-300" />
        <TaskDate value={task.dueDate} className="text-xs" />
      </div>

      <div className="flex items-center gap-x-1.5">
        <ProjectAvatar name={task.project.name} image={task.project.imageUrl} fallbackClassName="text-[10px]" />
        <span className="text-xs font-medium">{task.project.name}</span>
      </div>
    </div>
  );
};

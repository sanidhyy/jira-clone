import { Circle, CircleCheck, CircleDashed, CircleDot, CircleDotDashed, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useCreateTaskModal } from '@/features/tasks/hooks/use-create-task-modal';
import { TaskStatus } from '@/features/tasks/types';
import { snakeCaseToTitleCase } from '@/lib/utils';

interface KanbanColumnHeaderProps {
  board: TaskStatus;
  taskCount: number;
}

const statusIconMap: Record<TaskStatus, React.ReactNode> = {
  [TaskStatus.BACKLOG]: <CircleDashed className="size-[18px] text-pink-400" />,
  [TaskStatus.TODO]: <Circle className="size-[18px] text-red-400" />,
  [TaskStatus.IN_PROGRESS]: <CircleDotDashed className="size-[18px] text-yellow-400" />,
  [TaskStatus.IN_REVIEW]: <CircleDot className="size-[18px] text-blue-400" />,
  [TaskStatus.DONE]: <CircleCheck className="size-[18px] text-emerald-400" />,
};

export const KanbanColumnHeader = ({ board, taskCount }: KanbanColumnHeaderProps) => {
  const { open } = useCreateTaskModal();
  const icon = statusIconMap[board];

  return (
    <div className="flex items-center justify-between px-2 py-1.5">
      <div className="flex items-center gap-x-2">
        {icon}
        <h2 className="text-sm font-medium">{snakeCaseToTitleCase(board)}</h2>

        <div className="flex size-5 items-center justify-center rounded-md bg-neutral-200 text-xs font-medium text-neutral-700">
          {taskCount}
        </div>
      </div>

      <Button
        onClick={() => open(board)}
        variant="ghost"
        size="icon"
        className="size-5"
        title={`Create ${snakeCaseToTitleCase(board)} task`}
      >
        <Plus className="size-4 text-neutral-500" />
      </Button>
    </div>
  );
};

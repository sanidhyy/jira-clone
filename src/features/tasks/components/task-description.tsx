import { Pencil, XIcon } from 'lucide-react';
import { useState } from 'react';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateTask } from '@/features/tasks/api/use-update-task';
import type { Task } from '@/features/tasks/types';

interface TaskDescriptionProps {
  task: Task;
}

export const TaskDescription = ({ task }: TaskDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(task.description);

  const { mutate: editTask, isPending } = useUpdateTask();

  const handleSave = () => {
    editTask(
      {
        json: {
          description: value,
        },
        param: {
          taskId: task.$id,
        },
      },
      {
        onSuccess: () => setIsEditing(false),
      },
    );
  };

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Overview</p>

        <Button
          onClick={() => {
            setValue(task.description);
            setIsEditing((prevIsEditing) => !prevIsEditing);
          }}
          size="sm"
          variant="secondary"
        >
          {isEditing ? <XIcon className="mr-2 size-4" /> : <Pencil className="mr-2 size-4" />}
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>
      </div>

      <DottedSeparator className="my-4" />

      {isEditing ? (
        <div className="flex flex-col gap-y-4">
          <Textarea
            autoFocus
            placeholder="Add a description..."
            value={value}
            rows={4}
            onChange={(e) => setValue(e.target.value)}
            disabled={isPending}
          />

          <Button size="sm" className="ml-auto w-fit" onClick={handleSave} disabled={isPending}>
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      ) : (
        <div>{task.description || <span className="italic text-muted-foreground">No description set...</span>}</div>
      )}
    </div>
  );
};

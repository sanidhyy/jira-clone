'use client';

import { ResponsiveModal } from '@/components/responsive-modal';
import { useEditTaskModal } from '@/features/tasks/hooks/use-edit-task-modal';

import { EditTaskFormWrapper } from './edit-task-form-wrapper';

export const EditTaskModal = () => {
  const { taskId, close } = useEditTaskModal();

  return (
    <ResponsiveModal open={!!taskId} onOpenChange={close}>
      {taskId && <EditTaskFormWrapper id={taskId} onCancel={close} />}
    </ResponsiveModal>
  );
};

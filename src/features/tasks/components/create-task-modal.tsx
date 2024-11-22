'use client';

import { ResponsiveModal } from '@/components/responsive-modal';
import { useCreateTaskModal } from '@/features/tasks/hooks/use-create-task-modal';

import { CreateTaskFormWrapper } from './create-task-form-wrapper';

export const CreateTaskModal = () => {
  const { isOpen, initialStatus, close } = useCreateTaskModal();

  return (
    <ResponsiveModal
      title="Create Task"
      description="Create a new task and organize them in your project."
      open={isOpen}
      onOpenChange={close}
    >
      <CreateTaskFormWrapper initialStatus={initialStatus} onCancel={close} />
    </ResponsiveModal>
  );
};

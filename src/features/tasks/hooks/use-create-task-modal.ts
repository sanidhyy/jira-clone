import { parseAsBoolean, parseAsStringEnum, useQueryStates } from 'nuqs';

import { TaskStatus } from '@/features/tasks/types';

export const useCreateTaskModal = () => {
  const [{ isOpen, initialStatus }, setTaskModal] = useQueryStates({
    isOpen: parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true }),
    initialStatus: parseAsStringEnum(Object.values(TaskStatus)),
  });
  const open = (initialStatus?: TaskStatus) => setTaskModal({ isOpen: true, initialStatus: initialStatus ?? null });
  const close = () => setTaskModal({ isOpen: false, initialStatus: null });

  return {
    isOpen,
    initialStatus,
    setTaskModal,
    open,
    close,
  };
};

import { parseAsBoolean, parseAsStringEnum, useQueryState, useQueryStates } from 'nuqs';

import { TaskStatus } from '../types';

export const useCreateTaskModal = () => {
  const [{ isOpen, initialStatus }, setTaskModal] = useQueryStates({
    isOpen: parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true }),
    initialStatus: parseAsStringEnum(Object.values(TaskStatus)),
  });
  const open = (initialStatus?: TaskStatus) => setTaskModal({ isOpen: true, initialStatus });
  const close = () => setTaskModal({ isOpen: false, initialStatus: null });

  return {
    isOpen,
    initialStatus,
    setTaskModal,
    open,
    close,
  };
};

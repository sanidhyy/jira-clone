import { parseAsBoolean, useQueryState } from 'nuqs';

export const useCreateTaskModal = () => {
  const [isOpen, setIsOpen] = useQueryState('create-task', parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true }));

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return {
    isOpen,
    setIsOpen,
    open,
    close,
  };
};

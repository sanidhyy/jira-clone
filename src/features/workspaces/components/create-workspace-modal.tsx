'use client';

import { ResponsiveModal } from '@/components/responsive-modal';
import { useCreateWorkspaceModal } from '@/features/workspaces/hooks/use-create-workspace-modal';

import { CreateWorkspaceForm } from './create-workspace-form';

export const CreateWorkspaceModal = () => {
  const { isOpen, setIsOpen, close } = useCreateWorkspaceModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateWorkspaceForm onCancel={close} />
    </ResponsiveModal>
  );
};

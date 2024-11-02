'use client';

import { ResponsiveModal } from '@/components/responsive-modal';

import { CreateWorkspaceForm } from './create-workspace-form';

export const CreateWorkspaceModal = () => {
  return (
    <ResponsiveModal open={true} onOpenChange={() => {}}>
      <CreateWorkspaceForm />
    </ResponsiveModal>
  );
};

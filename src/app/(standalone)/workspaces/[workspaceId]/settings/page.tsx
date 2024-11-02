import { redirect } from 'next/navigation';

import { getCurrent } from '@/features/auth/queries';
import { EditWorkspaceForm } from '@/features/workspaces/components/edit-workspace-form';
import { getWorkspace } from '@/features/workspaces/queries';

interface WorkspaceIdSettingsPageProps {
  params: {
    workspaceId: string;
  };
}

const WorkspaceIdSettingsPage = async ({ params }: WorkspaceIdSettingsPageProps) => {
  const user = await getCurrent();

  if (!user) redirect('/sign-in');

  const initialValues = await getWorkspace({ workspaceId: params.workspaceId });

  if (!initialValues) redirect(`/workspaces/${params.workspaceId}`);

  return (
    <div className="w-full lg:max-w-xl">
      <EditWorkspaceForm initialValues={initialValues} />
    </div>
  );
};
export default WorkspaceIdSettingsPage;

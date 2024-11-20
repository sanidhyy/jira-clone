import { Loader2 } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { useGetProjects } from '@/features/projects/api/use-get-projects';
import type { TaskStatus } from '@/features/tasks/types';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';

import { CreateTaskForm } from './create-task-form';

interface CreateTaskFormWrapperProps {
  initialStatus?: TaskStatus | null;
  onCancel: () => void;
}

export const CreateTaskFormWrapper = ({ initialStatus, onCancel }: CreateTaskFormWrapperProps) => {
  const workspaceId = useWorkspaceId();

  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({ workspaceId });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId });

  const projectOptions = projects?.documents.map((project) => ({
    id: project.$id,
    name: project.name,
    imageUrl: project.imageUrl,
  }));

  const memberOptions = members?.documents.map((member) => ({
    id: member.$id,
    name: member.name,
  }));

  const isLoading = isLoadingMembers || isLoadingProjects;

  if (isLoading) {
    return (
      <Card className="h-[714px] w-full border-none shadow-none">
        <CardContent className="flex h-full items-center justify-center">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <CreateTaskForm
      initialStatus={initialStatus}
      onCancel={onCancel}
      projectOptions={projectOptions ?? []}
      memberOptions={memberOptions ?? []}
    />
  );
};

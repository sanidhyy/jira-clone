import { Pencil } from 'lucide-react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { getCurrent } from '@/features/auth/queries';
import { ProjectAvatar } from '@/features/projects/components/project-avatar';
import { getProject } from '@/features/projects/queries';

interface ProjectIdPageProps {
  params: { projectId: string };
}

const ProjectIdPage = async ({ params }: ProjectIdPageProps) => {
  const user = await getCurrent();

  if (!user) redirect('/sign-in');

  const initialValues = await getProject({
    projectId: params.projectId,
  });

  if (!initialValues) notFound();

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar name={initialValues.name} image={initialValues.imageUrl} className="size-8" />

          <p className="text-lg font-semibold">{initialValues.name}</p>
        </div>

        <div>
          <Button variant="secondary" size="sm" asChild>
            <Link href={`/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}/settings`}>
              <Pencil className="size-4 mr-2" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
export default ProjectIdPage;

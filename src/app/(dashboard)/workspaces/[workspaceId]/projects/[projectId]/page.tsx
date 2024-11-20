import { notFound, redirect } from 'next/navigation';

import { getCurrent } from '@/features/auth/queries';
import { getProject } from '@/features/projects/queries';

import { ProjectIdClient } from './client';

interface ProjectIdPageProps {
  params: { projectId: string };
}

const ProjectIdPage = async ({ params }: ProjectIdPageProps) => {
  const user = await getCurrent();

  if (!user) redirect('/sign-in');

  return <ProjectIdClient />;
};
export default ProjectIdPage;

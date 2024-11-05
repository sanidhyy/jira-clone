'use server';

import { DATABASE_ID, IMAGES_BUCKET_ID, PROJECTS_ID } from '@/config/db';
import { getMember } from '@/features/members/utils';
import { createSessionClient } from '@/lib/appwrite';

import type { Project } from './types';

interface GetProjectProps {
  projectId: string;
}

export const getProject = async ({ projectId }: GetProjectProps) => {
  try {
    const { account, databases, storage } = await createSessionClient();

    const project = await databases.getDocument<Project>(DATABASE_ID, PROJECTS_ID, projectId);

    const user = await account.get();
    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId: project.workspaceId,
    });

    if (!member) return null;

    let imageUrl: string | undefined = undefined;

    if (project.imageId) {
      const arrayBuffer = await storage.getFileView(IMAGES_BUCKET_ID, project.imageId);
      imageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`;
    }

    return {
      ...project,
      imageUrl,
    };
  } catch {
    return null;
  }
};

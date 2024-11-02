'use server';

import { type Models, Query } from 'node-appwrite';

import { DATABASE_ID, IMAGES_BUCKET_ID, MEMBERS_ID, WORKSPACES_ID } from '@/config/db';
import { getMember } from '@/features/members/utils';
import { createSessionClient } from '@/lib/appwrite';

import { Workspace } from './types';

export const getWorkspaces = async () => {
  try {
    const { account, databases, storage } = await createSessionClient();

    const user = await account.get();
    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [Query.equal('userId', user.$id)]);

    if (members.total === 0) return { documents: [], total: 0 };

    const workspaceIds = members.documents.map((member) => member.workspaceId);

    const workspaces = await databases.listDocuments(DATABASE_ID, WORKSPACES_ID, [
      Query.contains('$id', workspaceIds),
      Query.orderDesc('$createdAt'),
    ]);

    const workspacesWithImages: Models.Document[] = await Promise.all(
      workspaces.documents.map(async (workspace) => {
        let imageUrl: string | undefined = undefined;

        if (workspace.imageId) {
          const arrayBuffer = await storage.getFileView(IMAGES_BUCKET_ID, workspace.imageId);
          imageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`;
        }

        return {
          ...workspace,
          imageUrl,
        };
      }),
    );

    return {
      documents: workspacesWithImages,
      total: workspaces.total,
    };
  } catch {
    return { documents: [], total: 0 };
  }
};

interface GetWorkspaceProps {
  workspaceId: string;
}

export const getWorkspace = async ({ workspaceId }: GetWorkspaceProps) => {
  try {
    const { account, databases, storage } = await createSessionClient();

    const user = await account.get();
    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId,
    });

    if (!member) return null;

    const workspace = await databases.getDocument<Workspace>(DATABASE_ID, WORKSPACES_ID, workspaceId);

    let imageUrl: string | undefined = undefined;

    if (workspace.imageId) {
      const arrayBuffer = await storage.getFileView(IMAGES_BUCKET_ID, workspace.imageId);
      imageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`;
    }

    return {
      ...workspace,
      imageUrl,
    };
  } catch {
    return null;
  }
};

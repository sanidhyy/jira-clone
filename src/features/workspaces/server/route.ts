import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { ID, Models, Query } from 'node-appwrite';

import { DATABASE_ID, IMAGES_BUCKET_ID, MEMBERS_ID, WORKSPACES_ID } from '@/config/db';
import { MemberRole } from '@/features/members/types';
import { createWorkspaceSchema } from '@/features/workspaces/schema';
import { sessionMiddleware } from '@/lib/session-middleware';
import { generateInviteCode } from '@/lib/utils';

const app = new Hono()
  .get('/', sessionMiddleware, async (ctx) => {
    const databases = ctx.get('databases');
    const user = ctx.get('user');
    const storage = ctx.get('storage');

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [Query.equal('userId', user.$id)]);

    if (members.total === 0) return ctx.json({ data: { documents: [], total: 0 } });

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

    return ctx.json({
      data: {
        documents: workspacesWithImages,
        total: workspaces.total,
      },
    });
  })
  .post('/', zValidator('form', createWorkspaceSchema), sessionMiddleware, async (ctx) => {
    const databases = ctx.get('databases');
    const storage = ctx.get('storage');
    const user = ctx.get('user');

    const { name, image } = ctx.req.valid('form');

    let uploadedImageId: string | undefined = undefined;

    if (image instanceof File) {
      const file = await storage.createFile(IMAGES_BUCKET_ID, ID.unique(), image);

      uploadedImageId = file.$id;
    }

    const workspace = await databases.createDocument(DATABASE_ID, WORKSPACES_ID, ID.unique(), {
      name,
      userId: user.$id,
      imageId: uploadedImageId,
      inviteCode: generateInviteCode(6),
    });

    await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
      userId: user.$id,
      workspaceId: workspace.$id,
      role: MemberRole.ADMIN,
    });

    return ctx.json({ data: workspace });
  });

export default app;

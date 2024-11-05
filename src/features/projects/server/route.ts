import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { ID, Query } from 'node-appwrite';
import { z } from 'zod';

import { DATABASE_ID, IMAGES_BUCKET_ID, PROJECTS_ID } from '@/config/db';
import { getMember } from '@/features/members/utils';
import { createProjectSchema } from '@/features/projects/schema';
import { sessionMiddleware } from '@/lib/session-middleware';

const app = new Hono()
  .post('/', sessionMiddleware, zValidator('form', createProjectSchema), async (ctx) => {
    const databases = ctx.get('databases');
    const storage = ctx.get('storage');
    const user = ctx.get('user');

    const { name, image, workspaceId } = ctx.req.valid('form');

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return ctx.json({ error: 'Unauthorized.' }, 401);
    }

    let uploadedImageId: string | undefined = undefined;

    if (image instanceof File) {
      const file = await storage.createFile(IMAGES_BUCKET_ID, ID.unique(), image);

      uploadedImageId = file.$id;
    } else {
      uploadedImageId = image;
    }

    const project = await databases.createDocument(DATABASE_ID, PROJECTS_ID, ID.unique(), {
      name,
      userId: user.$id,
      imageId: uploadedImageId,
      workspaceId,
    });

    return ctx.json({ data: project });
  })
  .get(
    '/',
    sessionMiddleware,
    zValidator(
      'query',
      z.object({
        workspaceId: z.string(),
      }),
    ),
    async (ctx) => {
      const user = ctx.get('user');
      const databases = ctx.get('databases');

      const { workspaceId } = ctx.req.valid('query');

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return ctx.json({ error: 'Unauthorized.' }, 401);
      }

      const projects = await databases.listDocuments(DATABASE_ID, PROJECTS_ID, [
        Query.equal('workspaceId', workspaceId),
        Query.orderDesc('$createdAt'),
      ]);

      return ctx.json({ data: projects });
    },
  );

export default app;

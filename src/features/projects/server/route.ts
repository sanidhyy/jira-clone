import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { Query } from 'node-appwrite';
import { z } from 'zod';

import { DATABASE_ID, PROJECTS_ID } from '@/config/db';
import { getMember } from '@/features/members/utils';
import { sessionMiddleware } from '@/lib/session-middleware';

const app = new Hono().get(
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

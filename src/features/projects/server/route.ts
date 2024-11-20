import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { ID, Models, Query } from 'node-appwrite';
import { z } from 'zod';

import { DATABASE_ID, IMAGES_BUCKET_ID, PROJECTS_ID } from '@/config/db';
import { getMember } from '@/features/members/utils';
import { createProjectSchema, updateProjectSchema } from '@/features/projects/schema';
import type { Project } from '@/features/projects/types';
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
      const fileExt = image.name.split('.').at(-1) ?? 'png';
      const fileName = `${ID.unique()}.${fileExt}`;

      const renamedImage = new File([image], fileName, {
        type: image.type,
      });
      const file = await storage.createFile(IMAGES_BUCKET_ID, ID.unique(), renamedImage);

      uploadedImageId = file.$id;
    } else {
      uploadedImageId = image;
    }

    const project = await databases.createDocument(DATABASE_ID, PROJECTS_ID, ID.unique(), {
      name,
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
      const storage = ctx.get('storage');

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

      const projectsWithImages: Models.Document[] = await Promise.all(
        projects.documents.map(async (project) => {
          let imageUrl: string | undefined = undefined;

          if (project.imageId) {
            const arrayBuffer = await storage.getFileView(IMAGES_BUCKET_ID, project.imageId);
            imageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`;
          }

          return {
            ...project,
            imageUrl,
          };
        }),
      );

      return ctx.json({
        data: {
          documents: projectsWithImages,
          total: projects.total,
        },
      });
    },
  )
  .get('/:projectId', sessionMiddleware, async (ctx) => {
    const user = ctx.get('user');
    const databases = ctx.get('databases');
    const storage = ctx.get('storage');

    const { projectId } = ctx.req.param();

    const project = await databases.getDocument<Project>(DATABASE_ID, PROJECTS_ID, projectId);

    const member = await getMember({
      databases,
      workspaceId: project.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return ctx.json(
        {
          error: 'Unauthorized.',
        },
        401,
      );
    }

    let imageUrl: string | undefined = undefined;

    if (project.imageId) {
      const arrayBuffer = await storage.getFileView(IMAGES_BUCKET_ID, project.imageId);
      imageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`;
    }

    return ctx.json({
      data: {
        ...project,
        imageUrl,
      },
    });
  })
  .patch('/:projectId', sessionMiddleware, zValidator('form', updateProjectSchema), async (ctx) => {
    const databases = ctx.get('databases');
    const storage = ctx.get('storage');
    const user = ctx.get('user');

    const { projectId } = ctx.req.param();
    const { name, image } = ctx.req.valid('form');

    const existingProject = await databases.getDocument<Project>(DATABASE_ID, PROJECTS_ID, projectId);

    const member = await getMember({
      databases,
      workspaceId: existingProject.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return ctx.json(
        {
          error: 'Unauthorized.',
        },
        401,
      );
    }

    let uploadedImageId: string | undefined = undefined;

    if (image instanceof File) {
      const fileExt = image.name.split('.').at(-1) ?? 'png';
      const fileName = `${ID.unique()}.${fileExt}`;

      const renamedImage = new File([image], fileName, {
        type: image.type,
      });

      const file = await storage.createFile(IMAGES_BUCKET_ID, ID.unique(), renamedImage);

      uploadedImageId = file.$id;
    }

    const project = await databases.updateDocument(DATABASE_ID, PROJECTS_ID, projectId, {
      name,
      imageId: uploadedImageId,
    });

    return ctx.json({ data: project });
  })
  .delete('/:projectId', sessionMiddleware, async (ctx) => {
    const databases = ctx.get('databases');
    const user = ctx.get('user');

    const { projectId } = ctx.req.param();

    const existingProject = await databases.getDocument<Project>(DATABASE_ID, PROJECTS_ID, projectId);

    const member = await getMember({
      databases,
      workspaceId: existingProject.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return ctx.json({ error: 'Unauthorized.' }, 401);
    }

    // TODO: Delete tasks.

    await databases.deleteDocument(DATABASE_ID, PROJECTS_ID, projectId);

    return ctx.json({ data: { $id: existingProject.$id, workspaceId: existingProject.workspaceId } });
  });

export default app;

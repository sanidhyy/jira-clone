import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { ID, Models, Query } from 'node-appwrite';
import { z } from 'zod';

import { DATABASE_ID, IMAGES_BUCKET_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID } from '@/config/db';
import { getMember } from '@/features/members/utils';
import type { Project } from '@/features/projects/types';
import { createTaskSchema } from '@/features/tasks/schema';
import { type Task, TaskStatus } from '@/features/tasks/types';
import { createAdminClient } from '@/lib/appwrite';
import { sessionMiddleware } from '@/lib/session-middleware';

const app = new Hono()
  .get(
    '/',
    sessionMiddleware,
    zValidator(
      'query',
      z.object({
        workspaceId: z.string(),
        projectId: z.string().nullish(),
        assigneeId: z.string().nullish(),
        status: z.nativeEnum(TaskStatus).nullish(),
        search: z.string().nullish(),
        dueDate: z.string().nullish(),
      }),
    ),
    async (ctx) => {
      const { users } = await createAdminClient();
      const databases = ctx.get('databases');
      const storage = ctx.get('storage');
      const user = ctx.get('user');

      const { workspaceId, projectId, assigneeId, status, search, dueDate } = ctx.req.valid('query');

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return ctx.json({ error: 'Unauthorized.' }, 401);
      }

      const query = [Query.equal('workspaceId', workspaceId), Query.orderDesc('$createdAt')];

      if (projectId) query.push(Query.equal('projectId', projectId));

      if (status) query.push(Query.equal('status', status));

      if (assigneeId) query.push(Query.equal('assigneeId', assigneeId));

      if (dueDate) query.push(Query.equal('dueDate', dueDate));

      if (search) query.push(Query.search('name', search));

      const tasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, query);

      const projectIds = tasks.documents.map((task) => task.projectId);
      const assigneeIds = tasks.documents.map((task) => task.assigneeId);

      const projects = await databases.listDocuments<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectIds.length > 0 ? [Query.contains('$id', projectIds)] : [],
      );

      const members = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        assigneeIds.length > 0 ? [Query.contains('$id', assigneeIds)] : [],
      );

      const assignees = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);

          return {
            ...member,
            name: user.name,
            email: user.email,
          };
        }),
      );

      const populatedTasks: (Models.Document & Task)[] = await Promise.all(
        tasks.documents.map(async (task) => {
          const project = projects.documents.find((project) => project.$id === task.projectId);
          const assignee = assignees.find((assignee) => assignee.$id === task.assigneeId);

          let imageUrl: string | undefined = undefined;

          if (project?.imageId) {
            const arrayBuffer = await storage.getFileView(IMAGES_BUCKET_ID, project.imageId);
            imageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`;
          }

          return {
            ...task,
            project: {
              ...project,
              imageUrl,
            },
            assignee,
          };
        }),
      );

      return ctx.json({
        data: {
          ...tasks,
          documents: populatedTasks,
        },
      });
    },
  )
  .get('/:taskId', sessionMiddleware, async (ctx) => {
    const { taskId } = ctx.req.param();
    const currentUser = ctx.get('user');
    const databases = ctx.get('databases');

    const { users } = await createAdminClient();

    const task = await databases.getDocument<Task>(DATABASE_ID, TASKS_ID, taskId);

    const currentMember = await getMember({
      databases,
      workspaceId: task.workspaceId,
      userId: currentUser.$id,
    });

    if (!currentMember) {
      return ctx.json({ error: 'Unauthorized.' }, 401);
    }

    const project = await databases.getDocument<Project>(DATABASE_ID, PROJECTS_ID, task.projectId);

    const member = await databases.getDocument(DATABASE_ID, MEMBERS_ID, task.assigneeId);

    const user = await users.get(member.userId);

    const assignee = {
      ...member,
      name: user.name,
      email: user.email,
    };

    return ctx.json({
      data: {
        ...task,
        project,
        assignee,
      },
    });
  })
  .post('/', sessionMiddleware, zValidator('json', createTaskSchema), async (ctx) => {
    const user = ctx.get('user');
    const databases = ctx.get('databases');

    const { name, status, workspaceId, projectId, dueDate, assigneeId } = ctx.req.valid('json');

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return ctx.json({ error: 'Unauthorized.' }, 401);
    }

    const highestPositionTask = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal('status', status),
      Query.equal('workspaceId', workspaceId),
      Query.orderAsc('position'),
      Query.limit(1),
    ]);

    const newPosition = highestPositionTask.documents.length > 0 ? highestPositionTask.documents[0].position + 1000 : 1000;

    const task = await databases.createDocument<Task>(DATABASE_ID, TASKS_ID, ID.unique(), {
      name,
      status,
      workspaceId,
      projectId,
      dueDate,
      assigneeId,
      position: newPosition,
    });

    return ctx.json({ data: task });
  })
  .patch('/:taskId', sessionMiddleware, zValidator('json', createTaskSchema.partial()), async (ctx) => {
    const user = ctx.get('user');
    const databases = ctx.get('databases');

    const { name, status, description, projectId, dueDate, assigneeId } = ctx.req.valid('json');
    const { taskId } = ctx.req.param();

    const existingTask = await databases.getDocument<Task>(DATABASE_ID, TASKS_ID, taskId);

    const member = await getMember({
      databases,
      workspaceId: existingTask.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return ctx.json({ error: 'Unauthorized.' }, 401);
    }

    const task = await databases.updateDocument(DATABASE_ID, TASKS_ID, taskId, {
      name,
      status,
      projectId,
      dueDate,
      assigneeId,
      description,
    });

    return ctx.json({ data: task });
  })
  .post(
    '/bulk-update',
    sessionMiddleware,
    zValidator(
      'json',
      z.object({
        tasks: z.array(
          z.object({
            $id: z.string(),
            status: z.nativeEnum(TaskStatus),
            position: z.number().int().positive().min(1000).max(1_00_000),
          }),
        ),
      }),
    ),
    async (ctx) => {
      const databases = ctx.get('databases');
      const user = ctx.get('user');
      const { tasks } = ctx.req.valid('json');

      const tasksToUpdate = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
        Query.contains(
          '$id',
          tasks.map((task: { $id: any }) => task.$id),
        ),
      ]);

      const workspaceIds = new Set(tasksToUpdate.documents.map((task) => task.workspaceId));

      if (workspaceIds.size !== 1) {
        return ctx.json({ error: 'All tasks must belong to the same workspace.' }, 401);
      }

      const workspaceId = workspaceIds.values().next().value!;

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return ctx.json({ error: 'Unauthorized.' }, 401);
      }

      const updatedTasks = await Promise.all(
        tasks.map(async (task: { $id: any; status: any; position: any }) => {
          const { $id, status, position } = task;

          return databases.updateDocument<Task>(DATABASE_ID, TASKS_ID, $id, { status, position });
        }),
      );

      return ctx.json({ data: { updatedTasks, workspaceId } });
    },
  )
  .delete('/:taskId', sessionMiddleware, async (ctx) => {
    const user = ctx.get('user');
    const databases = ctx.get('databases');

    const { taskId } = ctx.req.param();

    const task = await databases.getDocument<Task>(DATABASE_ID, TASKS_ID, taskId);

    const member = await getMember({
      databases,
      workspaceId: task.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return ctx.json({ error: 'Unauthorized.' }, 401);
    }

    await databases.deleteDocument(DATABASE_ID, TASKS_ID, taskId);

    return ctx.json({ data: task });
  });

export default app;

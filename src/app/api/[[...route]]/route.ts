import { Hono } from 'hono';
import { handle } from 'hono/vercel';

export const runtime = 'nodejs';

const app = new Hono().basePath('/api');

app.get('/hello', (ctx) => {
  return ctx.json({ hello: 'world!' });
});

app.get('/project/:projectId', (ctx) => {
  const { projectId } = ctx.req.param();

  return ctx.json({ projectId });
});

export const GET = handle(app);

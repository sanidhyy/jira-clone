import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

import { signInFormSchema } from '@/features/auth/schema';

const app = new Hono().post('/login', zValidator('json', signInFormSchema), async (ctx) => {
  const { email, password } = ctx.req.valid('json');

  console.log({ email, password });

  return ctx.json({ email, password });
});

export default app;

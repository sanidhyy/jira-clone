import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

import { signInFormSchema, signUpFormSchema } from '@/features/auth/schema';

const app = new Hono()
  .post('/login', zValidator('json', signInFormSchema), async (ctx) => {
    const { email, password } = ctx.req.valid('json');

    console.log({ email, password });

    return ctx.json({ email, password });
  })
  .post('/register', zValidator('json', signUpFormSchema), async (ctx) => {
    const { name, email, password } = ctx.req.valid('json');

    console.log({ name, email, password });

    return ctx.json({ name, email, password });
  });

export default app;

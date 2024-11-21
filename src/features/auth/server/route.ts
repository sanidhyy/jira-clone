import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { deleteCookie, setCookie } from 'hono/cookie';
import { ID } from 'node-appwrite';
import { z } from 'zod';

import { AUTH_COOKIE } from '@/features/auth/constants';
import { signInFormSchema, signUpFormSchema } from '@/features/auth/schema';
import { createAdminClient } from '@/lib/appwrite';
import { sessionMiddleware } from '@/lib/session-middleware';

const app = new Hono()
  .get(
    '/',
    zValidator(
      'query',
      z.object({
        userId: z.string().trim().min(1),
        secret: z.string().trim().min(1),
      }),
    ),
    async (ctx) => {
      const { userId, secret } = ctx.req.valid('query');

      const { account } = await createAdminClient();
      const session = await account.createSession(userId, secret);

      setCookie(ctx, AUTH_COOKIE, session.secret, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 30,
      });

      return ctx.redirect(process.env.NEXT_PUBLIC_APP_BASE_URL);
    },
  )
  .get('/current', sessionMiddleware, (ctx) => {
    const user = ctx.get('user');

    return ctx.json({ data: user });
  })
  .post('/login', zValidator('json', signInFormSchema), async (ctx) => {
    const { email, password } = ctx.req.valid('json');

    const { account } = await createAdminClient();

    const session = await account.createEmailPasswordSession(email, password);

    setCookie(ctx, AUTH_COOKIE, session.secret, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30,
    });

    return ctx.json({ success: true });
  })
  .post('/register', zValidator('json', signUpFormSchema), async (ctx) => {
    const { name, email, password } = ctx.req.valid('json');

    const { account } = await createAdminClient();

    await account.create(ID.unique(), email, password, name);

    const session = await account.createEmailPasswordSession(email, password);

    setCookie(ctx, AUTH_COOKIE, session.secret, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30,
    });

    return ctx.json({ success: true });
  })
  .post('/logout', sessionMiddleware, async (ctx) => {
    const account = ctx.get('account');

    deleteCookie(ctx, AUTH_COOKIE);
    await account.deleteSession('current');

    return ctx.json({ success: true });
  });

export default app;

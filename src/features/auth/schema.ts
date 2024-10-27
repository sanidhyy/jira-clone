import { z } from 'zod';

export const signInFormSchema = z.object({
  email: z.string().trim().email({
    message: 'Invalid email.',
  }),
  password: z.string().min(1, 'Password is required.'),
});

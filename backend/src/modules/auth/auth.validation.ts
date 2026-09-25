import { z } from 'zod';

export const authValidation = {
  createOrLoginSchema: z.object({
    body: z.object({
      email: z.string().email({ message: 'Valid email address is required' }),
      name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
      avatar: z.string().url().optional().nullable(),
      role: z.enum(['CLIENT', 'ADMIN']).optional(),
    }),
  }),
};

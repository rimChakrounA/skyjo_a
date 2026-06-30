import { z } from 'zod';

export const registerSchema = z.object({
  username: z
    .string()
    .min(2, 'Le pseudo doit contenir au moins 2 caractères.')
    .max(20, 'Le pseudo ne peut pas dépasser 20 caractères.')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Caractères autorisés : lettres, chiffres, _ et -.'),
  password: z
    .string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères.')
    .max(72, 'Le mot de passe est trop long.'),
});

export const loginSchema = z.object({
  username: z.string().min(1, 'Le pseudo est requis.'),
  password: z.string().min(1, 'Le mot de passe est requis.'),
});

export type RegisterBody = z.infer<typeof registerSchema>;
export type LoginBody = z.infer<typeof loginSchema>;

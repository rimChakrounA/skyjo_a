import { PrismaClient } from '@prisma/client';

/** Instance partagée du client Prisma. */
export const prisma = new PrismaClient();

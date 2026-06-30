import type { PrismaClient } from '@prisma/client';

export interface CreateUserInput {
  username: string;
  passwordHash: string;
}

export async function findUserByUsername(prisma: PrismaClient, username: string) {
  return prisma.user.findUnique({ where: { username } });
}

export async function findUserById(prisma: PrismaClient, id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function createUser(prisma: PrismaClient, input: CreateUserInput) {
  return prisma.user.create({
    data: {
      username: input.username,
      passwordHash: input.passwordHash,
    },
  });
}

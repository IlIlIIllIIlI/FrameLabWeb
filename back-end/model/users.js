import { prisma } from "../db/prisma.ts";

export async function getAll() {
  const allUsers = await prisma.users.findMany();

  return allUsers;
}

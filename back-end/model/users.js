import { prisma } from "../db/prisma.ts";

export async function getAll() {
  const allUsers = await prisma.users.findMany();

  return allUsers;
}

export async function getPasswordByEmail(email) {
  try {
    const data = await prisma.users.findUniqueOrThrow({
      where: {
        email: email,
      },
      select: {
        password: true,
      },
    });

    return data.password;
  } catch (PrismaClientKnownRequestError) {
    return null;
  }
}

export async function getUserByEmail(email) {
  try {
    const data = await prisma.users.findUniqueOrThrow({
      where: {
        email: email,
      },
    });

    return data;
  } catch (PrismaClientKnownRequestError) {
    return false;
  }
}

export async function createUser(email, firstName, lastName, password) {
  try {
    await prisma.users.create({
      data: {
        email: email,
        first_name: firstName,
        last_name: lastName,
        password: password,
      },
    });

    return true;
  } catch (error) {
    return false;
  }
}

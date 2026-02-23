import { prisma } from "../db/prisma.ts";

export async function getAll() {
  const allUsers = await prisma.users.findMany({
    omit: {
      password: true,
    },
  });

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
  } catch (error) {
    throw error
  }
}

export async function getUserByEmail(email) {
  try {
    const data = await prisma.users.findUniqueOrThrow({
      where: {
        email: email,
      },
      omit: {
        password: true,
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


export async function getIsAdminByEmail(email) {
  try {
    const data = await prisma.users.findUniqueOrThrow({
      where: {
        email: email,
      },
      select: {
        is_admin: true,
      },
    });

    console.log(data);
    return data;


  } catch (PrismaClientKnownRequestError) {
    return false;
  }
}
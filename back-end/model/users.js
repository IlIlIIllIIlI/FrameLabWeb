import { prisma } from "../db/prisma.ts";


export async function getAll() {
  const allUsers = await prisma.users.findMany({
    // Not sending the password
    omit: {
      password: true,
    },
  });

  return allUsers;
}


//Gets all the entries the user posted
export async function getUserProfileData(userId) {
  const allData = prisma.users.findUnique({
    where: {
      id: userId
    },
    omit: {
      password: true
    },
    include: {
      entries: {
        include: {
          challenges: true,
          users: {
            select: { first_name: true, last_name: true }
          }
        },
        orderBy: {
          submit_date: 'desc'
        }
      },
      comments: {
        include: {
          entries: {
            select: {
              id: true,
              edited_picture_url: true,
              challenge_id: true
            }
          }
        },
        orderBy: {
          date: 'desc'
        }
      },
      votes: {
        include: {
          entries: {
            select: {
              id: true,
              edited_picture_url: true,
              challenge_id: true
            }
          }
        },
        orderBy: {
          vote_date: 'desc'
        }
      }
    }
  });

  return allData
}


//Get only the user info

export async function getUserById(id) {
  const user = await prisma.users.findUnique({
    where: {
      id: id
    },
    omit: {
      password: true // Privacy
    },
  })

  if (!user) {
    return null
  }

  return user
}

// Exclusively used by the authentication controller to compare passwords against the stored hash.
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
    return null;
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
  } catch (error) {

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

// For isAdmin Middleware
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

    return data;
  } catch (error) {
    // If the user isn't found, default to not an admin
    return false;
  }
}

export async function activateUserAccount(userId) {
  return await prisma.users.update({
    where: {
      id: userId
    },
    data: {
      is_activated: true
    },
  });
}
import { prisma } from "../db/prisma.ts";

export async function getArchived() {
  const allChallenges = await prisma.challenges.findMany({
    where: {
      is_archived: true,
    },
  });

  return allChallenges;
}


export async function getCurrent() {
  try {
    // findFirstOrThrow will automatically throw an error if no active challenge is found
    const res = await prisma.challenges.findFirstOrThrow({
      where: {
        is_archived: false,
      },
    });

    return { success: true, challenge: res };
  } catch (error) {
    return {
      success: false,
      message: "No challenge for now",
    };
  }
}


export async function getLatest() {
  try {
    // Order by ID descending to grab the newest record
    const res = await prisma.challenges.findFirstOrThrow({
      orderBy: {
        id: "desc",
      },
    });

    return { success: true, challenge: res };
  } catch (error) {
    return {
      success: false,
      message: "No challenge",
    };
  }
}


export async function create(
  title,
  description,
  start_date,
  end_date,
  picture,
) {
  try {
    const challenge = await prisma.challenges.create({
      data: {
        theme_title: title,
        theme_description: description,
        // Prisma requires actual Date objects for DateTime fields
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        required_picture_url: picture,
      },
    });
    return { success: true, challenge: challenge };
  } catch (error) {
    return { success: false, message: "Something happened, please try later" };
  }
}

export async function archiveChallenge(id) {
  try {
    const update = await prisma.challenges.update({
      where: {
        id: id,
      },
      data: {
        is_archived: true,
      },
    });

    return { success: true };
  } catch (error) {
    return { success: false, message: "Something happened, please try later" };
  }
}


export async function getChallenge(id) {
  try {
    const data = await prisma.challenges.findUniqueOrThrow({
      where: {
        id: id,
      },
      // Include User with the challenge
      include: {
        entries: {
          include: {
            users: {
              // Only pull the first and last name of the user for security/privacy
              select: { first_name: true, last_name: true },
            },
          },
        },
      },
    });

    return { success: true, challenge: data };
  } catch (error) {
    return { success: false, message: "Challenge does not exist" };
  }
} 
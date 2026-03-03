import { prisma } from "../db/prisma.ts";

export async function createEntry(challengeId, userId, picture) {
  try {
    const entry = await prisma.entries.create({
      data: {
        challenge_id: challengeId,
        user_id: userId,
        edited_picture_url: picture,
      },
    });
    return { success: true, entry: entry };
  } catch (error) {
    return { success: false, message: "Something happened, please try later" };
  }
}

export async function getEntryByChallengeAndUser(challengeId, userId) {
  try {
    const entry = await prisma.entries.findFirst({
      where: {
        user_id: userId,
        challenge_id: challengeId,
      },
    });

    if (!entry) {
      return {
        success: false,
        message: "No Entry",
      };
    }
    return { success: true, entry: res };
  } catch (err) {
    return {
      success: false,
      message: "Something happened, please try later",
    };
  }
}

export async function getEntryById(id) {
  try {
    const entry = await prisma.entries.findUniqueOrThrow({
      where: { id: id },
      include: {
        users: { select: { first_name: true, last_name: true } },
        challenges: { select: { is_archived: true } },
        comments: {
          include: {
            users: { select: { first_name: true, last_name: true } },
          },
          orderBy: { date: "desc" },
        },
      },
    });
    return { success: true, entry: entry };
  } catch (error) {
    console.log(error);

    return { success: false, message: "Entry does not exist" };
  }
}

import { prisma } from "../db/prisma.ts";


export async function createEntry(challengeId, userId, picture) {
  try {
    const entry = await prisma.entries.create({
      data: {
        challenge_id: challengeId,
        user_id: userId,
        // Stores the relative path to the image in the public folder
        edited_picture_url: picture,
      },
    });
    return { success: true, entry: entry };
  } catch (error) {
    return { success: false, message: "Something happened, please try later" };
  }
}

// Looks up an entry using both the challenge ID and user ID.
export async function getEntryByChallengeAndUser(challengeId, userId) {
  try {
    const entry = await prisma.entries.findFirst({
      where: {
        user_id: userId,
        challenge_id: challengeId,
      },
    });

    // findFirst returns null if no record is found
    if (!entry) {
      return {
        success: false,
        message: "No Entry",
      };
    }

    return { success: true, entry: entry };
  } catch (err) {
    return {
      success: false,
      message: "Something happened, please try later",
    };
  }
}

// Retrieves a specific entry and deeply populates it with related data from comments, challenge and users
export async function getEntryById(id) {
  try {

    const entry = await prisma.entries.findUniqueOrThrow({
      where: { id: id },

      include: {
        // Fetch the user who submitted the entry
        users: { select: { first_name: true, last_name: true } },

        // Fetch the associated challenge to check if voting is still allowed 
        challenges: { select: { is_archived: true } },

        // Fetch all comments left on this specific entry
        comments: {
          include: {
            //fetch the names of the users who wrote those comments
            users: { select: { first_name: true, last_name: true } },
          },
          // Sort the comments chronologically, newest first
          orderBy: { date: "desc" },
        },
      },
    });

    return { success: true, entry: entry };
  } catch (error) {
    return { success: false, message: "Entry does not exist" };
  }
}
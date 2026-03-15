import { prisma } from "../db/prisma.ts";


export async function getAll() {
  const allVotes = await prisma.votes.findMany();

  return allVotes;
}


export async function createVote(
  entryId,
  userId,
  technicalRating,
  creativityRating,
  themeRespectRating,
) {
  try {
    const vote = await prisma.votes.create({
      data: {
        entry_id: entryId,
        user_id: userId,
        technical_rating: technicalRating,
        creativity_rating: creativityRating,
        theme_respect_rating: themeRespectRating,
      },
    });

    return { success: true, vote: vote };
  } catch (error) {
    return { success: false, message: "Something happened, please try later" };
  }
}

// Looks up a specific vote using both the entry ID and the user ID.
export async function getVoteByEntryAndUser(entryId, userId) {
  try {
    // If a vote exists, it returns the object. If not, it returns null.
    const vote = await prisma.votes.findFirst({
      where: {
        user_id: userId,
        entry_id: entryId,
      },
    });


    if (!vote) {
      return {
        success: false,
        message: "No vote",
      };
    }

    // If a vote is found, return it
    return { success: true, vote: vote };
  } catch (error) {
    return {
      success: false,
      message: "Something happened, please try later",
    };
  }
}
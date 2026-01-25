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

export async function getVoteByEntryAndUser(entryId, userId) {
  try {
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
    return { success: true, vote: vote };
  } catch (err) {
    return {
      success: false,
      message: "Something happened, please try later",
    };
  }
}

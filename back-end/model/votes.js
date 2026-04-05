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

// Gets all the user stats
export async function getUserGlobalStats(userId) {
  const stats = await prisma.votes.aggregate({
    where: {
      entries: {
        user_id: userId
      }
    },
    _avg: {
      creativity_rating: true,
      technical_rating: true,
      theme_respect_rating: true
    },
    _count: {
      id: true
    }
  });

  if (!stats._avg.creativity_rating) {
    stats._avg.creativity_rating = 0
  }

  if (!stats._avg.technical_rating) {
    stats._avg.technical_rating = 0
  }
  if (!stats._avg.theme_respect_rating) {
    stats._avg.theme_respect_rating = 0
  }
  const globalAvg = (stats._avg.creativity_rating + stats._avg.technical_rating + stats._avg.theme_respect_rating) / 3

  return {
    totalVotes: stats._count.id,
    averages: {
      creativity: stats._avg.creativity_rating,
      technical: stats._avg.technical_rating,
      theme: stats._avg.theme_respect_rating,
      global: globalAvg
    }
  };
}


// Gets all the user stats
export async function getEntryGlobalStats(entryId) {
  const stats = await prisma.votes.aggregate({
    where: {
      entries: {
        id: entryId
      }
    },
    _avg: {
      creativity_rating: true,
      technical_rating: true,
      theme_respect_rating: true
    },
    _count: {
      id: true
    }
  });

  if (!stats._avg.creativity_rating) {
    stats._avg.creativity_rating = 0
  }

  if (!stats._avg.technical_rating) {
    stats._avg.technical_rating = 0
  }
  if (!stats._avg.theme_respect_rating) {
    stats._avg.theme_respect_rating = 0
  }
  const globalAvg = (stats._avg.creativity_rating + stats._avg.technical_rating + stats._avg.theme_respect_rating) / 3

  return {
    totalVotes: stats._count.id,
    averages: {
      creativity: stats._avg.creativity_rating,
      technical: stats._avg.technical_rating,
      theme: stats._avg.theme_respect_rating,
      global: globalAvg
    }
  };
}

//Get user stats vote
export async function getUserEntryStats(userId) {
  const stats = await prisma.votes.groupBy({
    by: ['entry_id'],
    where: {
      entries: { user_id: userId }
    },
    _avg: {
      creativity_rating: true,
      technical_rating: true,
      theme_respect_rating: true
    },
    _count: {
      _all: true
    }
  });

  const formattedStats = [];

  for (const stat of stats) {
    if (!stat._avg.creativity_rating) {
      stat._avg.creativity_rating = 0
    }

    if (!stat._avg.technical_rating) {
      stat._avg.technical_rating = 0
    }
    if (!stat._avg.theme_respect_rating) {
      stat._avg.theme_respect_rating = 0
    }
    const globalAvg = (stat._avg.creativity_rating + stat._avg.technical_rating + stat._avg.theme_respect_rating) / 3

    formattedStats.push({
      entry_id: stat.entry_id,
      totalVotes: stat._count._all,
      averages: {
        creativity: stat._avg.creativity_rating,
        technical: stat._avg.technical_rating,
        theme: stat._avg.theme_respect_rating,
        global: globalAvg
      }
    });


  }

  return formattedStats;
}
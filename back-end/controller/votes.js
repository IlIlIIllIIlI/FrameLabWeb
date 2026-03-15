import * as voteModel from "../model/votes.js";

// Fetches all votes
export async function getAllVotes(req, res) {
  const votes = await voteModel.getAll();

  res.json({ success: true, votes });
}

export async function castVote(req, res) {
  const userId = req.body.userId;
  const entryId = req.body.entryId;
  const technicalRating = req.body.technicalRating;
  const creativityRating = req.body.creativityRating;
  const themeRespectRating = req.body.themeRespectRating;

  // Ensure the  IDs exist
  if (!userId) {
    return res.status(404).json({ message: "no user" });
  }
  if (!entryId) {
    return res.status(404).json({ message: "no entry" });
  }

  // check if this user has already voted this entry
  const userVote = await voteModel.getVoteByEntryAndUser(
    parseInt(entryId),
    parseInt(userId),
  );

  if (userVote.success) {
    return res
      .status(404)
      .json({ message: "You already have a Vote for this entry" });
  }

  // Ensure all ratings fall strictly within the 0 to 5 range.
  if (!themeRespectRating || themeRespectRating < 0 || themeRespectRating > 5) {
    return res
      .status(404)
      .json({ message: "Theme Respect Rating must be between 0 and 5" });
  }

  if (!creativityRating || creativityRating < 0 || creativityRating > 5) {
    return res
      .status(404)
      .json({ message: "Creativity Rating must be between 0 and 5" });
  }

  if (!technicalRating || technicalRating < 0 || technicalRating > 5) {
    return res
      .status(404)
      .json({ message: "Technical Rating must be between 0 and 5" });
  }


  const vote = await voteModel.createVote(
    parseInt(entryId),
    parseInt(userId),
    technicalRating,
    creativityRating,
    themeRespectRating,
  );

  if (vote.success) {
    return res.json({ message: "Votes created successfully!" });
  }

  res.json(vote);
}
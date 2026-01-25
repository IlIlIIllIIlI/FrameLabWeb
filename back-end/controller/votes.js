import * as voteModel from "../model/votes.js";

export async function getAllVotes(req, res) {
  const users = await voteModel.getAll();
  res.json({ success: true, users });
}

export async function castVote(req, res) {
  const userId = req.body.userId;
  const entryId = req.body.entryId;
  const technicalRating = req.body.technicalRating;
  const creativityRating = req.body.creativityRating;
  const themeRespectRating = req.body.themeRespectRating;

  if (!userId) {
    return res.status(404).json({ message: "no user" });
  }
  if (!entryId) {
    return res.status(404).json({ message: "no entry" });
  }
  const userVote = await voteModel.getVoteByEntryAndUser(
    parseInt(entryId),
    parseInt(userId),
  );

  if (userVote.success) {
    return res
      .status(404)
      .json({ message: "You already have a Vote for this entry" });
  }

  if (themeRespectRating < 0 || themeRespectRating > 5) {
    return res
      .status(404)
      .json({ message: "Theme Respect Rating must be between 0 and 5" });
  }

  if (creativityRating < 0 || creativityRating > 5) {
    return res
      .status(404)
      .json({ message: "Ceativity Rating must be between 0 and 5" });
  }

  if (technicalRating < 0 || technicalRating > 5) {
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
    return res.json({ message: "Entry created successfully!" });
  }

  res.json(vote);
}

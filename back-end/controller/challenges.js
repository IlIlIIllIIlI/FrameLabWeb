import * as challengeModel from "../model/challenges.js";
import * as voteUtils from "../utils/voteutils.js"
import fs from "fs";
import jwt from "jsonwebtoken";

// Fetches a list of all past challenges that have been marked as archived.
export async function getArchivedChallenges(req, res) {
  const challenges = await challengeModel.getArchived();
  res.json(challenges);

}
// Fetches the single active challenge
export async function getCurrentChallenge(req, res) {
  const challenge = await challengeModel.getCurrent();
  return res.json(challenge);
}

// Fetches a specific challenge by its ID
export async function getChallengeById(req, res) {
  // Parse the ID from the URL parameters
  const challenge = await challengeModel.getChallenge(parseInt(req.params.id));


  if (challenge.success) {

    if (challenge.challenge.entries) {
      const session = req.cookies?.session;
      if (session) {

        const data = jwt.verify(session, process.env.PRIVATE_KEY);

        if (data.user.id) {

          challenge.challenge.entries = await voteUtils.enrichEntriesWithVoteData(challenge.challenge.entries, data.user.id);
        }
      }
    }
    return res.json(challenge);
  } else {
    res.status(404).json(challenge);
  }
}


export async function createChallenge(req, res) {
  const title = req.body.title;
  const description = req.body.description;
  const start_date = req.body.start_date;
  const end_date = req.body.end_date;

  // Ensure none of the required text fields are null, undefined, or just empty spaces
  if (title == null || title.trim().length === 0) {
    return res.status(401).json({ message: "Invalid Title" });
  }

  if (description == null || description.trim().length === 0) {
    return res.status(401).json({ message: "Invalid description" });
  }

  if (start_date == null || start_date.trim().length === 0) {
    return res.status(401).json({ message: "Invalid start date" });
  }

  if (end_date == null || end_date.trim().length === 0) {
    return res.status(401).json({ message: "Invalid end date" });
  }

  // Check if there is already an active challenge running
  const currentChallenge = await challengeModel.getCurrent();
  if (currentChallenge.success) {
    return res
      .status(404)
      .json({ message: "There is already a challenge going on" });
  }

  // Find the ID of the most recently created challenge so we can name the image folder correctly
  const latestChallenge = await challengeModel.getLatest();
  const latestId = latestChallenge.success ? latestChallenge.challenge.id : 0;

  //  save the new challenge to the database
  const chall = await challengeModel.create(
    req.body.title,
    req.body.description,
    req.body.start_date,
    req.body.end_date,
    `challenges/${latestId + 1}/${req.file.filename}`,
  );

  if (chall.success) {
    // Create the  public directory path based on the challenge ID
    const newDir = `./public/challenges/${latestId + 1}`;

    // If this folder doesn't exist yet, create it
    if (!fs.existsSync(newDir)) {
      fs.mkdirSync(newDir, { recursive: true });
    }

    // Move the file from the Multer /temp/ folder to its public folder
    fs.renameSync(req.file.path, `${newDir}/${req.file.filename}`);

    return res.json({ message: "Challenge created successfully!" });
  } else {
    // If the database insertion failed ,Rollback
    fs.unlinkSync(req.file.path);
    res.status(500).json(chall);
  }
}

export async function archiveChallenge(req, res) {
  const challengeId = req.body.id;

  // verify the challenge actually in the database
  const chall = await challengeModel.getChallenge(challengeId);

  if (chall.success) {
    if (chall.challenge.is_archived) {
      return res.status(403).json({ message: "Challenge is already archived" });
    }

    // update the is_archived flag to true
    const archive = await challengeModel.archiveChallenge(challengeId);

    if (archive.success) {
      res.json(archive);
    } else {
      res.status(404).json(archive);
    }
  } else {
    return res.status(404).json({ message: "Challenge does not exist" });
  }
}
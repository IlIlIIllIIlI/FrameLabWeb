import * as entriesModel from "../model/entries.js";
import * as voteUtils from "../utils/voteutils.js"
import fs from "fs";
import jwt from "jsonwebtoken";

// Handles the submission of a new image entry for a specific challenge.
export async function createEntry(req, res) {
  const userId = req.body.userId;
  const challengeId = req.body.challengeId;

  // Ensure both a User ID and a Challenge ID are provided in the request body
  if (!userId) {
    return res.status(401).json({
      message: "No User",
    });
  }

  if (!challengeId) {
    return res.status(401).json({
      message: "No Challenge",
    });
  }

  // Check if this user has already submitted an entry for this challenge
  const userEntry = await entriesModel.getEntryByChallengeAndUser(
    parseInt(challengeId),
    parseInt(userId),
  );

  // If success is true, an entry already exists
  if (userEntry.success) {
    return res
      .status(404)
      .json({ message: "You already have an Entry for this challenge" });
  }

  // save the entry  to the database.
  const entry = await entriesModel.createEntry(
    parseInt(challengeId),
    parseInt(userId),
    `entries/${challengeId}/${userId}/${req.file.filename}`,
  );

  if (entry.success) {
    // Organized by challenge, then by user.
    const newDir = `./public/entries/${challengeId}/${userId}`;

    // Check if this directory structure exists. If not, create it.
    if (!fs.existsSync(newDir)) {
      fs.mkdirSync(newDir, { recursive: true });
    }

    // Move the uploaded images temp path to its permanent home
    fs.renameSync(req.file.path, `${newDir}/${req.file.filename}`);

    return res.json({ message: "Entry created successfully!" });
  } else {
    // Rollback if fail
    fs.unlinkSync(req.file.path);
    res.status(500).json(entry);
  }
}

// Fetches a specific entry
export async function getEntryById(req, res) {
  const entryId = parseInt(req.params.id);



  const response = await entriesModel.getEntryById(entryId);

  if (!response.success) {
    return res.status(404).json(response);
  }

  const session = req.cookies?.session;
  if (session) {

    const data = jwt.verify(session, process.env.PRIVATE_KEY);

    if (data.user) {

      const entry = await voteUtils.enrichEntriesWithVoteData(response.entry, data.user.id);

      return res.json({ success: true, entry: entry });

    }
  }

  return res.json({ success: true, entry: response.entry });
}

export async function getEntries(req, res) {
  let entries;
  if (req.query.challenge) {
    entries = await entriesModel.getEntriesByChallenge(parseInt(req.query.challenge))
  } else {
    entries = await entriesModel.getAllEntries()
  }

  if (!entries) {
    res.status(404).json({ success: false, message: "No entries" });

  } else {
    res.json({ success: true, entries });
  }


}
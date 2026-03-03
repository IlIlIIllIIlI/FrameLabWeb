import * as entriesModel from "../model/entries.js";
import fs from "fs";

export async function createEntry(req, res) {
  const userId = req.body.userId;
  const challengeId = req.body.challengeId;

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

  const userEntry = await entriesModel.getEntryByChallengeAndUser(
    parseInt(challengeId),
    parseInt(userId),
  );

  if (userEntry.success) {
    return res
      .status(404)
      .json({ message: "You already have an Entry for this challenge" });
  }

  const entry = await entriesModel.createEntry(
    parseInt(challengeId),
    parseInt(userId),
    `entries/${challengeId}/${userId}/${req.file.filename}`,
  );

  if (entry.success) {
    const newDir = `./public/entries/${challengeId}/${userId}`;

    if (!fs.existsSync(newDir)) {
      fs.mkdirSync(newDir, { recursive: true });
    }

    fs.renameSync(req.file.path, `${newDir}/${req.file.filename}`);

    return res.json({ message: "Entry created successfully!" });
  } else {
    fs.unlinkSync(req.file.path);
    res.status(500).json(entry);
  }
}

export async function getEntryById(req, res) {
  const entry = await entriesModel.getEntryById(parseInt(req.params.id));
  if (entry.success) {
    return res.json(entry);
  } else {
    res.status(404).json(entry);
  }
}

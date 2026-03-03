import * as challengeModel from "../model/challenges.js";
import fs from "fs";

export async function getArchivedChallenges(req, res) {
  const challenges = await challengeModel.getArchived();
  res.json(challenges);
}

export async function getCurrentChallenge(req, res) {
  const challenge = await challengeModel.getCurrent();

  return res.json(challenge);
}

export async function getChallengeById(req, res) {
  const challenge = await challengeModel.getChallenge(parseInt(req.params.id));
  if (challenge.success) {
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

  if (title == null || title.trim().length === 0) {
    return res.status(401).json({
      message: "Invalid Title",
    });
  }

  if (description == null || description.trim().length === 0) {
    return res.status(401).json({
      message: "Invalid description",
    });
  }

  if (start_date == null || start_date.trim().length === 0) {
    return res.status(401).json({
      message: "Invalid start date",
    });
  }

  if (end_date == null || end_date.trim().length === 0) {
    return res.status(401).json({
      message: "Invalid end date",
    });
  }
  const currentChallenge = await challengeModel.getCurrent();

  if (currentChallenge.success) {
    return res
      .status(404)
      .json({ message: "There is already a challenge going on" });
  }
  const latestChallenge = await challengeModel.getLatest();
  const latestId = latestChallenge.success ? latestChallenge.challenge.id : 0;
  const chall = await challengeModel.create(
    req.body.title,
    req.body.description,
    req.body.start_date,
    req.body.end_date,
    `challenges/${latestId + 1}/${req.file.filename}`,
  );

  if (chall.success) {
    const newDir = `./public/challenges/${latestId + 1}`;

    if (!fs.existsSync(newDir)) {
      fs.mkdirSync(newDir, { recursive: true });
    }

    fs.renameSync(req.file.path, `${newDir}/${req.file.filename}`);

    return res.json({ message: "Challenge created successfully!" });
  } else {
    fs.unlinkSync(req.file.path);
    res.status(500).json(chall);
  }
}

export async function archiveChallenge(req, res) {
  const challengeId = req.body.id;
  const chall = await challengeModel.getChallenge(challengeId);
  if (chall.success) {
    if (chall.challenge.is_archived) {
      return res.status(403).json({ message: "Challenge is already archived" });
    }
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

import * as challengeModel from "../model/users.js";
import multer from "multer";
import fs from "fs";


export async function getAllChallenges(req, res) {
    const challenges = await challengeModel.getAll()
    res.json(challenges);
}


export async function getCurrentChallenge(req, res) {
    const challenge = await challengeModel.getCurrent()

    res.header("Authorization", "Bearer <token>")
    res.json(challenge)
}



const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.fieldname);
    }
});

export const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});


export async function createChallenge(req, res) {

    const currentChallenge = await getCurrent()

    if (currentChallenge.success) {
        res.error();
    }
    const latestid = await challengeModel.getLatest().id;
    const chall = await challengeModel.create(req.body.title, req.body.description, req.body.start_date, req.body.end_date, `challenges/${latestid + 1}/${req.file.filename}`)
    if (chall.success) {
        fs.mv(req.file.path, `../public/challenges/${latestid + 1}`)
    } else {
        fs.rm(req.file.path)
        res.error(500)
    }
}

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images only! (jpeg, jpg, png, gif)');
    }
}
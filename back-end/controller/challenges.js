import * as challengeModel from "../model/users.js";

export async function getAllChallenges(req, res) {
    const challenges = await challengeModel.getAll()
    res.json({ success: true, challenges });
}


export async function getCurrentChallenge(req, res) {
    const challenge = await challengeModel.getCurrent()

    res.header("Authorization", "Bearer <token>")
    if (challengeModel.getCurrent()) {
        res.json({
            "success": true, challenge
        })
    } else {
        res.json({

            "success": false,
            "message": "challenge not found",
            "error": 402

        })
    }
}
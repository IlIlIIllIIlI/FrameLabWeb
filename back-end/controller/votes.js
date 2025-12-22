import * as voteModel from "../model/votes.js";


export async function getAllVotes(req, res) {
    const users = await voteModel.getAll()
    res.json({ success: true, users });
}
import * as commentModel from "../model/comments.js";

export async function getAllComments(req, res) {
    const comments = await commentModel.getAll()
    res.json(comments);
}

export async function getCommentById(req, res) {
    const comment = await commentModel.getCommentById(req.params.id)

    res.json(comment)
}

export async function deleteCommentById(req, res) {
    if (commentModel.deleteCommentById()) {
        res.json({
            "success": true,
            "message": "Message deleted successfully"
        })
    } else {
        res.json({

            "success": false,
            "message": "Comment not found",
            "error": 402

        })
    }
}
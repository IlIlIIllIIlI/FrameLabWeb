import * as commentModel from "../model/comments.js";

export async function getAllComments(req, res) {
  const comments = await commentModel.getAll();
  res.json(comments);
}

export async function getCommentById(req, res) {
  const comment = await commentModel.getCommentById(req.params.id);

  res.json(comment);
}

export async function deleteCommentById(req, res) {
  if (await commentModel.deleteCommentById(parseInt(req.params.id))) {
    res.json({
      success: true,
      message: "Message deleted successfully",
    });
  } else {
    res.status(402).json({
      success: false,
      message: "Comment not found",
    });
  }
}

export async function addComment(req, res) {
  const content = req.body.content;
  const userId = req.body.userId;
  const entryId = req.body.entryId;

  if (!content || content.trim() === "") {
    return res.status(404).json({ message: "No content" });
  }

  if (!userId) {
    return res.status(404).json({ message: "No User" });
  }

  if (!entryId) {
    return res.status(404).json({ message: "No entryId" });
  }

  const comment = await commentModel.createComment(
    parseInt(entryId),
    parseInt(userId),
    content,
  );

  if (comment.success) {
    return res.json({ message: "Comment created successfully!" });
  }

  res.json(comment);
}

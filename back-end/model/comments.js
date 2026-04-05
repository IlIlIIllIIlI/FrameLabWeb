import { prisma } from "../db/prisma.ts";


export async function getAll() {
  const allComments = await prisma.comments.findMany();

  return allComments;
}


export async function getCommentById(id) {
  const comment = await prisma.comments.findUnique({
    where: {
      id: id,
    }
  });

  return comment;
}


export async function deleteCommentById(id) {
  try {
    await prisma.comments.delete({
      where: {
        id: id,
      },
    });

    return true;
  } catch (error) {
    return false;
  }
}


export async function createComment(entryId, userId, content) {
  try {
    const comment = await prisma.comments.create({
      data: {
        entry_id: entryId,
        user_id: userId,
        content: content,
      },
    });

    // Return a structured success object containing the newly created comment data
    return { success: true, comment: comment };
  } catch (error) {

    return { success: false, message: "Something happened, please try later" };
  }
}

export async function editCommentById(commentId, content) {
  try {
    const comment = await prisma.comments.update({
      where: {
        id: commentId
      },

      data: {
        content: content
      }
    })

    return true;

  } catch {
    return false;

  }
}
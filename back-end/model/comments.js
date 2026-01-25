import { prisma } from "../db/prisma.ts";

export async function getAll() {
  const allComments = await prisma.comments.findMany();

  return allComments;
}

export async function getCommentById(id) {
  const comment = await prisma.comments.findUnique({
    where: {
      id: id,
    },
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
  } catch (PrismaClientKnownRequestError) {
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
    return { success: true, comment: comment };
  } catch (error) {
    console.log(error);

    return { success: false, message: "Something happened, please try later" };
  }
}

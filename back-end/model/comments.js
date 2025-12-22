import { prisma } from "../db/prisma.ts";

export async function getAll() {
    const allComments = await prisma.comments.findMany();

    return allComments;
}

export async function getCommentById(id) {
    const comment = await prisma.comments.findUnique({
        where: {
            id: id
        }
    })

    return comment
}

export async function deleteCommentById(id) {
    try {
        await prisma.comments.delete({
            where: {
                id: id
            }
        })

        return true
    } catch (PrismaClientKnownRequestError) {
        return false
    }
}


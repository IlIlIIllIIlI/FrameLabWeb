import { prisma } from "../db/prisma.ts";

export async function getAll() {
    const allComments = await prisma.challenges.findMany();

    return allComments;
}

export async function getCurrent() {
    try {
        await prisma.challenges.findFirstOrThrow({
            where: {
                is_archived: false
            }
        })

        return true
    } catch (PrismaClientKnownRequestError) {
        return false
    }
}
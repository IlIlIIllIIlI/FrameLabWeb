import { prisma } from "../db/prisma.ts";

export async function getAll() {
    const allComments = await prisma.challenges.findMany();

    return allComments;
}

export async function getCurrent() {
    try {
        const res = await prisma.challenges.findFirstOrThrow({
            where: {
                is_archived: false
            }
        })

        return { "success": true, "challenge": res }
    } catch (PrismaClientKnownRequestError) {
        return {
            "success": false,
            "message": "No challenge for now"
        }
    }
}

export async function getLatest() {
    try {
        const res = await prisma.challenges.findFirstOrThrow({
            orderBy: {
                id: 'desc'
            }
        })

        return { "success": true, "challenge": res }
    } catch (PrismaClientKnownRequestError) {
        return {
            "success": false,
            "message": "No challenge"
        }
    }
}

export async function create(title, description, start_date, end_date, picture) {
    try {
        const challenge = prisma.challenges.create({
            data: {
                title: title
            }
        })
    } catch (error) {

    }
}
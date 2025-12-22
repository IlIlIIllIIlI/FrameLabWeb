import { prisma } from "../db/prisma.ts";

export async function getAll() {
    const allVotes = await prisma.votes.findMany();

    return allVotes;
}
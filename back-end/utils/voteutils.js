import * as voteModel from '../model/votes.js'

export async function enrichEntriesWithVoteData(entries, currentUserId) {
    const isArray = Array.isArray(entries);
    const entriesArray = isArray ? entries : [entries];

    const enrichedEntries = [];

    for (const entry of entriesArray) {
        let hasVoted = false;
        let userVote = null;

        // Check if the user voted
        if (currentUserId) {
            const voteRes = await voteModel.getVoteByEntryAndUser(entry.id, currentUserId);
            if (voteRes.success) {
                hasVoted = true;
                userVote = voteRes.vote;
            }
        }

        // Check if challenge is archived
        const isArchived = entry.challenges?.is_archived === true;

        // Attach the stats
        if (hasVoted || isArchived) {
            entry.stats = await voteModel.getEntryGlobalStats(entry.id);
            entry.has_voted = hasVoted;
            entry.user_vote = userVote || null;
        } else {
            entry.stats = null;
            entry.has_voted = false;
        }

        enrichedEntries.push(entry);
    };

    return isArray ? enrichedEntries : enrichedEntries[0];
}
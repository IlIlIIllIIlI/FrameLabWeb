import * as userModel from "../model/users.js";
import * as voteModel from "../model/votes.js";
import * as voteUtils from "../utils/voteutils.js"

// Fetches all Users 
export async function getAllUsers(req, res) {
  const users = await userModel.getAll();
  res.json({ success: true, users });
}


// Fetches all Data from one User (entries, comments)

export async function getUser(req, res) {
  const userId = parseInt(req.params.id);
  const currentUserId = req.user?.id; // Needed to check if the viewer has voted

  if (req.query.full) {
    const user = await userModel.getUserProfileData(userId);
    const globalStats = await voteModel.getUserGlobalStats(userId); // Fixed to User stats

    if (!user) {
      return res.status(404).json({ success: false, message: "User Not Found" });
    }

    // Fusing entries with stats using our new utility function instead of a manual loop
    let entriesWithStats = [];
    if (user.entries && user.entries.length > 0) {
      entriesWithStats = await voteUtils.enrichEntriesWithVoteData(user.entries, currentUserId);
    }

    const fullUser = {
      ...user,
      entries: entriesWithStats,
      statistics: {
        total_entries: user.entries ? user.entries.length : 0,
        ...globalStats
      }
    };

    return res.json({ success: true, user: fullUser });
  } else {
    const user = await userModel.getUserById(req.params.id);

    if (!user) {
      res.status(404).json({ success: false, message: "User Not Found" });
    } else {
      res.json({ success: true, user });
    }
  }
}
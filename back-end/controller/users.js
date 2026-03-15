import * as userModel from "../model/users.js";


// Fetches all Users 
export async function getAllUsers(req, res) {
  const users = await userModel.getAll();
  res.json({ success: true, users });
}




import * as userModel from "../model/users.js";

export async function getAllUsers(req, res) {
  const users = await userModel.getAll();
  res.json({ success: true, users });
}




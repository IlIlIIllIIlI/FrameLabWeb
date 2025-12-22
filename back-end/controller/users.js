import * as userModel from "../model/users.js";

export async function getAllUsers(req, res) {
  res.json(await userModel.getAll());
}

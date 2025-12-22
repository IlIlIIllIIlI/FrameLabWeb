import { Router } from "express";
import { getAllUsers } from "./controller/users.js";

const router = Router();

/**
 * @openapi
 * /users:
 *   get:
 *     description: Get all users
 *     responses:
 *       200:
 *         description: successful operation.
 */
router.route("/users").get((req, res) => {
  getAllUsers(req, res);
});

/**
 * @openapi
 * /challenges:
 *   get:
 *     description: Get all challenges
 *     responses:
 *       200:
 *         description: successful operation.
 */
router.route("/challenges").get((req, res) => {
  getAllChallenges(req, res);
});
export default router;

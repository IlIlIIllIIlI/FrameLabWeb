import { Router } from "express";
import {
  getAllUsers,
  login,
  auth,
  isAdmin,
  register,
  getUserByCookie,
} from "./controller/users.js";
import {
  getArchivedChallenges,
  getCurrentChallenge,
  createChallenge,
  archiveChallenge,
  getChallengeById,
} from "./controller/challenges.js";
import {
  getAllComments,
  getCommentById,
  deleteCommentById,
  addComment,
} from "./controller/comments.js";
import { getAllVotes, castVote } from "./controller/votes.js";
import {
  createEntry,
  getAllEntries,
  getEntryById,
} from "./controller/entries.js";
import { uploadImage } from "./config/mutler.js";

const router = Router();

/**
 * @openapi
 * /api/users:
 *   get:
 *     description: Get all users
 *     responses:
 *       200:
 *         description: successful operation.
 */
router.route("/users").get((req, res) => {
  auth(req, res);
  getAllUsers(req, res);
});

/**
 * @openapi
 * /api/challenges:
 *   get:
 *     description: Get all challenges
 *     responses:
 *       200:
 *         description: successful operation.
 */
router
  .route("/challenges")
  .get(getArchivedChallenges)
  .post(auth, isAdmin, uploadImage, createChallenge);

router.route("/challenges/:id").get(getChallengeById);
/**
 * @openapi
 * /api/challenges/current:
 *   get:
 *     description: Get current challenge
 *     responses:
 *       200:
 *         description: successful operation.
 */

router
  .route("/challenge/current")
  .get(auth, getCurrentChallenge)
  .put(auth, isAdmin, archiveChallenge);
/**
 * @openapi
 * /api/comments:
 *   get:
 *     description: Get all comments
 *     responses:
 *       200:
 *         description: successful operation.
 */

router.route("/comments").get(auth, getAllComments).post(auth, addComment);

/**
* @openapi
* /api/comments/:id:
*   get:
*     description: Find a comment by id
*     parameters:
*        - name: id
*          in: query
*          description: the id of the comment
*          required: true
*          schema:
*            type: int
*     responses:
*       200:
*         description: successful operation.
*   delete:
*     description: Delete a comment by id
*     parameters:
*        - name: id
*          in: query
*          description: the id of the comment
*          required: true
*          schema:
*            type: int
*     responses:
*       200:
*         description: Comment deleted successfully.
*       402:
          description: Comment not found.
*/

router
  .route("/comments/:id")
  .get((req, res) => {
    auth(req, res);
    getCommentById(req, res);
  })
  .delete((req, res) => {
    auth(req, res);
    isAdmin(req, res);
    deleteCommentById(req, res);
  });
/**
 * @openapi
 * /api/votes:
 *   get:
 *     description: Get all votes
 *     responses:
 *       200:
 *         description: successful operation.
 */

router.route("/votes").get(auth, getAllVotes).post(auth, castVote);

/**
 * @openapi
 * /api/entries:
 *   get:
 *     description: Get all entries
 *     responses:
 *       200:
 *         description: successful operation.
 */

router
  .route("/entries")
  .get(auth, getAllEntries)
  .post(auth, uploadImage, createEntry);

router.route("/entries/:id").get(getEntryById);
router.post("/auth/login", login);

router.post("/auth/register", register);

router.get("/auth/me", getUserByCookie);
export default router;

import { Router } from "express";
import { getAllUsers, login } from "./controller/users.js";
import { getAllChallenges, getCurrentChallenge } from "./controller/challenges.js";
import { getAllComments, getCommentById, deleteCommentById } from "./controller/comments.js";
import { getAllVotes } from "./controller/votes.js";
import { register } from "module";

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
router.route("/challenges").get((req, res) => {
  getAllChallenges(req, res);
});

/**
 * @openapi
 * /api/challenges/current:
 *   get:
 *     description: Get current challenge
 *     responses:
 *       200:
 *         description: successful operation.
 */

router.route("/challenges/current").get((req, res) => {
  getCurrentChallenge(req, res)
})
/**
 * @openapi
 * /api/comments:
 *   get:
 *     description: Get all comments
 *     responses:
 *       200:
 *         description: successful operation.
 */

router.route("/comments")
  .get((req, res) => {
    getAllComments(req, res);
  })

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

router.route("/comments/:id")
  .get((req, res) => {
    getCommentById(req, res);
  })
  .delete((req, res) => {
    deleteCommentById(req, res);
  })
/**
 * @openapi
 * /api/votes:
 *   get:
 *     description: Get all votes
 *     responses:
 *       200:
 *         description: successful operation.
 */


router.route("/votes").get((req, res) => {
  getAllVotes(req, res)
})

/**
 * @openapi
 * /api/entries:
 *   get:
 *     description: Get all entries
 *     responses:
 *       200:
 *         description: successful operation.
 */

router.route("/entries").get((req, res) => {
  getAllEntries(req, res)
})
export default router;

router.post("/auth/login", login(req, res));

router.post("/auth/register", register(req, res));
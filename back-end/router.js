import { Router } from "express";
import {
  getAllUsers,
  getUser
} from "./controller/users.js";
import {
  login,
  auth,
  isAdmin,
  register,
  logoutUser,
  getUserByCookie,
  verifyAccount
} from "./controller/auth.js";
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
  editCommentById,
} from "./controller/comments.js";
import { getAllVotes, castVote } from "./controller/votes.js";
import {
  createEntry,
  getEntryById,
  getEntries
} from "./controller/entries.js";
import { uploadImage } from "./config/mutler.js";

const router = Router();

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user with email and password. Returns a JWT token and sets a session cookie.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     is_admin:
 *                       type: boolean
 *       401:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Incorrect Email or password
 *       403:
 *         description: Account not activated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Please activate your account before logging in.
 *       404:
 *         description: Missing email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Email and password Can't be empty
 */
router.post("/auth/login", login);

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: User registration
 *     description: 
 *       Registers a new user account. Password must meet requirements:
 *       - Minimum 8 characters
 *       - At least one uppercase letter
 *       - At least one lowercase letter
 *       - At least one digit
 *       - At least one special character (#?!@$%^&*-.,)
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: newuser@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Must contain uppercase, lowercase, digit, and special character
 *                 example: Password123!
 *               firstName:
 *                 type: string
 *                 example: Jean
 *               lastName:
 *                 type: string
 *                 example: Pierre
 *     responses:
 *       200:
 *         description: Successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Account created successfully!
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid input or account already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Email already exist
 */
router.post("/auth/register", register);

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     summary: Get current user from cookie
 *     description: Retrieves the current authenticated user information from the session cookie
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Successfully retrieved user information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     is_admin:
 *                       type: boolean
 *       401:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid or expired token
 *       404:
 *         description: No session cookie found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No cookie
 */
router.get("/auth/me", getUserByCookie);

/**
 * @openapi
 * /api/auth/logout:
 *   get:
 *     summary: User logout
 *     description: Logs out the user by clearing the session cookie. Requires authentication.
 *     tags:
 *       - Authentication
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: You need to be logged in
 */
router.get("/auth/logout", auth, logoutUser);

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieves a list of all users in the system. Requires authentication.
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       email:
 *                         type: string
 *                         example: user@example.com
 *                       firstName:
 *                         type: string
 *                         example: Jean
 *                       lastName:
 *                         type: string
 *                         example: Pierre
 *                       is_admin:
 *                         type: boolean
 *                         example: false
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: You need to be logged in
 */
router.route("/users").get(auth, getAllUsers);

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieves a specific user by their ID. Add ?full query parameter to get detailed profile with entries and statistics. Requires authentication.
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The user ID
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: full
 *         required: false
 *         description: Include full profile data with entries and statistics
 *         schema:
 *           type: boolean
 *           example: true
 *     responses:
 *       200:
 *         description: Successfully retrieved user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User Not Found
 */
router.route("/users/:id").get(auth, getUser)
/**
 * @openapi
 * /api/challenges:
 *   get:
 *     summary: Get all archived challenges
 *     description: Retrieves a list of all archived challenges
 *     tags:
 *       - Challenges
 *     responses:
 *       200:
 *         description: Successfully retrieved archived challenges
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   title:
 *                     type: string
 *                     example: Challenge 1
 *                   description:
 *                     type: string
 *                     example: Edit this picture to look funny
 *                   start_date:
 *                     type: string
 *                     format: date
 *                     example: 2026-03-01
 *                   end_date:
 *                     type: string
 *                     format: date
 *                     example: 2026-03-31
 *                   is_archived:
 *                     type: boolean
 *                     example: true
 *                   image:
 *                     type: string
 *                     example: challenges/1/image.jpg
 *   post:
 *     summary: Create a new challenge
 *     description: Creates a new challenge. Requires admin authentication and an image file.
 *     tags:
 *       - Challenges
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - start_date
 *               - end_date
 *               - file
 *             properties:
 *               title:
 *                 type: string
 *                 example: Challenge
 *               description:
 *                 type: string
 *                 example: Edit this picture to look funny
 *               start_date:
 *                 type: string
 *                 format: date
 *                 example: 2026-06-01
 *               end_date:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-31
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Challenge created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Challenge created successfully!
 *       401:
 *         description: Invalid title, description, start date, or end date
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid Title
 *       403:
 *         description:  Admin privileges required or there is already a challenge going on
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: You need to be an admin to go further
 *       404:
 *         description: There is already a challenge going on
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: There is already a challenge going on
 */
router
  .route("/challenges")
  .get(getArchivedChallenges)
  .post(auth, isAdmin, uploadImage, createChallenge);

/**
 * @openapi
 * /api/challenges/current:
 *   get:
 *     summary: Get current active challenge
 *     description: Retrieves the currently active (non-archived) challenge. Requires authentication.
 *     tags:
 *       - Challenges
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved current challenge
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 challenge:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     start_date:
 *                       type: string
 *                       format: date
 *                     end_date:
 *                       type: string
 *                       format: date
 *                     is_archived:
 *                       type: boolean
 *                     image:
 *                       type: string
 *       401:
 *         description: Unauthorized - Authentication required
 *   put:
 *     summary: Archive current challenge
 *     description: Archives the currently active challenge, making it unavailable for new entries. Requires admin authentication.
 *     tags:
 *       - Challenges
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *                 description: The challenge ID to archive
 *                 example: 1
 *     responses:
 *       200:
 *         description: Challenge archived successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Admin privileges required or challenge already archived
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: You need to be an admin to go further
 *       404:
 *         description: Challenge not found or already archived
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Challenge does not exist
 */
router
  .route("/challenges/current")
  .get(auth, getCurrentChallenge)
  .put(auth, isAdmin, archiveChallenge);


/**
 * @openapi
 * /api/challenges/{id}:
 *   get:
 *     summary: Get challenge by ID
 *     description: Retrieves a specific challenge by its ID
 *     tags:
 *       - Challenges
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The challenge ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved challenge
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 challenge:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     start_date:
 *                       type: string
 *                       format: date
 *                     end_date:
 *                       type: string
 *                       format: date
 *                     is_archived:
 *                       type: boolean
 *                     image:
 *                       type: string
 *       404:
 *         description: Challenge not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Challenge not found
 */
router.route("/challenges/:id").get(getChallengeById);


/**
 * @openapi
 * /api/entries:
 *   post:
 *     summary: Create a new entry
 *     description: Creates a new entry (submission) for a challenge. Requires authentication and an image file. Each user can only submit one entry per challenge.
 *     tags:
 *       - Entries
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - challengeId
 *               - file
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 5
 *               challengeId:
 *                 type: integer
 *                 example: 1
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Image file for the entry
 *     responses:
 *       200:
 *         description: Entry created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Entry created successfully!
 *       401:
 *         description: Missing userId or challengeId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No User
 *       404:
 *         description: Duplicate entry or missing challengeId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: You already have an Entry for this challenge
 *       500:
 *         description: Server error
 */
router
  .route("/entries")
  .post(auth, uploadImage, createEntry);

/**
 * @openapi
 * /api/entries/{id}:
 *   get:
 *     summary: Get entry by ID
 *     description: Retrieves a specific entry (submission) by its ID
 *     tags:
 *       - Entries
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The entry ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved entry
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 entry:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     userId:
 *                       type: integer
 *                     challengeId:
 *                       type: integer
 *                     image:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Entry not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 */
router.route("/entries/:id").get(getEntryById);

/**
 * @openapi
 * /api/entries:
 *   get:
 *     summary: Get all entries or filter by challenge
 *     description: Retrieves entries. Use ?challenge=id query parameter to filter by challenge ID. Requires authentication.
 *     tags:
 *       - Entries
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: challenge
 *         required: false
 *         description: Filter entries by challenge ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved entries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 entries:
 *                   type: array
 *       404:
 *         description: No entries found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: No entries
 */
router.route("/entries").get(auth, getEntries);

/**
 * @openapi
 * /api/comments:
 *   get:
 *     summary: Get all comments
 *     description: Retrieves all comments in the system.
 *     tags:
 *       - Comments
 *     responses:
 *       200:
 *         description: Successfully retrieved all comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *   post:
 *     summary: Add a new comment
 *     description: Creates a new comment on an entry. Requires authentication.
 *     tags:
 *       - Comments
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - userId
 *               - entryId
 *             properties:
 *               content:
 *                 type: string
 *                 example: Cool
 *               userId:
 *                 type: integer
 *                 example: 5
 *               entryId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Comment created successfully!
 *       401:
 *         description: You need to be logged in
 *       404:
 *         description: Missing required fields (content, userId, or entryId)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No content
 */
router.route("/comments").get(auth, getAllComments).post(auth, addComment);

/**
 * @openapi
 * /api/comments/{id}:
 *   get:
 *     summary: Get comment by ID
 *     description: Retrieves a specific comment by its ID.
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The comment ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved comment
 *   delete:
 *     summary: Delete a comment
 *     description: Deletes a comment by ID. Requires admin authentication.
 *     tags:
 *       - Comments
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The comment ID to delete
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Message deleted successfully
 *       404:
 *         description: Comment not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Comment not found
 *   put:
 *     summary: Edit comment by ID
 *     description: Edit a specific comment by its ID. Requires authentication.
 *     tags:
 *       - Comments
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The comment ID
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: Updated comment
 *     responses:
 *       200:
 *         description: Successfully edited comment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Message edited successfully
 *       404:
 *         description: Comment not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Comment not found 
 */
router
  .route("/comments/:id")
  .get(auth, getCommentById)
  .delete(auth, deleteCommentById)
  .put(auth, editCommentById)

/**
 * @openapi
 * /api/votes:
 *   get:
 *     summary: Get all votes
 *     description: Retrieves all votes cast in the system. Requires authentication.
 *     tags:
 *       - Votes
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all votes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 votes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       entryId:
 *                         type: integer
 *                       userId:
 *                         type: integer
 *                       technicalRating:
 *                         type: number
 *                         format: float
 *                         minimum: 0
 *                         maximum: 5
 *                       creativityRating:
 *                         type: number
 *                         format: float
 *                         minimum: 0
 *                         maximum: 5
 *                       themeRespectRating:
 *                         type: number
 *                         format: float
 *                         minimum: 0
 *                         maximum: 5
 *       401:
 *         description: Unauthorized - Authentication required
 *   post:
 *     summary: Cast a vote on an entry
 *     description: Creates a vote on an entry with ratings for technical quality, creativity, and theme respect. Requires authentication. Each user can only vote once per     entry. All ratings must be between 0 and 5.
 *     tags:
 *       - Votes
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - entryId
 *               - technicalRating
 *               - creativityRating
 *               - themeRespectRating
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 5
 *               entryId:
 *                 type: integer
 *                 example: 1
 *               technicalRating:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 5
 *                 description: Rating for technical quality (0-5)
 *                 example: 5
 *               creativityRating:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 5
 *                 description: Rating for creativity and originality (0-5)
 *                 example: 4
 *               themeRespectRating:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 5
 *                 description: Rating for how well the entry matches the theme (0-5)
 *                 example: 5
 *     responses:
 *       200:
 *         description: Vote recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Votes created successfully!
 *       404:
 *         description: Missing userId, entryId, duplicate vote, or invalid rating values
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: You already have a Vote for this entry
 */
router.route("/votes").get(auth, getAllVotes).post(auth, castVote);

/**
 * @openapi
 * /api/auth/verify:
 *   post:
 *     summary: Verify and activate user account
 *     description: Activates a user account using a verification token sent via email
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         description: The account verification token
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Account successfully activated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Account successfully activated! You can now log in.
 *       400:
 *         description: No token provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: No token provided
 *       401:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid or expired activation link.
 */
router.post("/auth/verify", verifyAccount);

export default router;




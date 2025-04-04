import { Router } from "express";
import {
  getUsers,
  getUserById,
  getUserWithAccounts,
} from "../controllers/userController";
import { verifyToken } from "../middlewares/verifyToken";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (Admin only)
 *     description: This route requires authentication and the "ADMIN" role.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Successfully retrieved users
 *       401:
 *         description: Unauthorized - User must be authenticated
 *       403:
 *         description: Forbidden - User does not have the required role
 *     x-role: admin
 */
router.get("/", verifyToken, authorizeRoles("ADMIN"), getUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID (Admin and User only)
 *     description: This route requires authentication and the "ADMIN" role or the "USER" role with strict access.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved user
 *       401:
 *         description: Unauthorized - User must be authenticated
 *       403:
 *         description: Forbidden - User does not have the required role or strict access denied
 */
router.get(
  "/:id",
  verifyToken,
  authorizeRoles("ADMIN", { USER: { strict: true } }),
  getUserById
);

/**
 * @swagger
 * /users/{id}/accounts:
 *   get:
 *     summary: Get accounts of a user by ID (Admin and User only)
 *     description: Retrieve the accounts associated with a specific user. This route requires authentication and either the "ADMIN" role or the "USER" role with strict access.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user whose accounts are to be retrieved.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved user accounts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   accountId:
 *                     type: string
 *                     description: The unique ID of the account.
 *                   accountType:
 *                     type: string
 *                     description: The type of the account (e.g., savings, checking).
 *                   balance:
 *                     type: number
 *                     description: The current balance of the account.
 *       401:
 *         description: Unauthorized - User must be authenticated.
 *       403:
 *         description: Forbidden - User does not have the required role or strict access denied.
 *       500:
 *         description: Internal server error.
 */
router.get(
  "/:id/accounts",
  verifyToken,
  authorizeRoles("ADMIN", { USER: { strict: true } }),
  (req, res) => {
    getUserWithAccounts(req, res);
  }
);
export default router;

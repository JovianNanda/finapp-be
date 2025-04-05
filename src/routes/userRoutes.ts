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
router.get("/:id", verifyToken, authorizeRoles("ADMIN", "USER"), getUserById);

/**
 * @swagger
 * /users/{id}/accounts:
 *   get:
 *     summary: Get a user with their accounts (Admin and User only)
 *     description: This route requires authentication and the "ADMIN" role or the "USER" role with strict access.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user whose accounts are to be retrieved
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved user with accounts
 *       401:
 *         description: Unauthorized - User must be authenticated
 *       403:
 *         description: Forbidden - User does not have the required role or strict access denied
 */
router.get(
  "/:id/accounts",
  verifyToken,
  authorizeRoles("ADMIN", "USER"),
  (req, res) => {
    getUserWithAccounts(req, res);
  }
);
export default router;

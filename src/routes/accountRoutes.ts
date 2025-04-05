import { Router } from "express";
import {
  getAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
} from "../controllers/accountController";
import { verifyToken } from "../middlewares/verifyToken";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

/**
 * @swagger
 * /accounts:
 *   get:
 *     summary: Get all accounts (Admin only)
 *     description: This route requires authentication and the "ADMIN" role.
 *     tags: [Accounts]
 *     responses:
 *       200:
 *         description: List of accounts
 *
 *       500:
 *         description: Server error
 */
router.get("/", verifyToken, authorizeRoles("ADMIN"), getAccounts);

/**
 * @swagger
 * /accounts/{id}:
 *   get:
 *     summary: Get account by ID (Admin and User only)
 *     description: This route requires authentication and the "ADMIN" role or the "USER" role with strict access.
 *     tags: [Accounts]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the account to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Account details
 *       404:
 *         description: Account not found
 */
router.get(
  "/:id",
  verifyToken,
  authorizeRoles("ADMIN", "USER"),
  getAccountById
);

/**
 * @swagger
 * /accounts:
 *   post:
 *     summary: Create a new Finance account
 *     description: This route requires authentication.
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [PERSONAL | SHARED]
 *     responses:
 *       201:
 *         description: Account created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", verifyToken, createAccount);

/**
 * @swagger
 * /accounts/{id}:
 *   patch:
 *     summary: Update an existing Finance account
 *     description: This route requires authentication.
 *     tags: [Accounts]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the account to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: ["PERSONAL", "SHARED"]
 *     responses:
 *       200:
 *         description: Account updated successfully
 *       400:
 *        description: Bad request
 *       404:
 *        description: Account not found
 *       500:
 *        description: Server error
 * */
router.patch(
  "/:id",
  verifyToken,
  authorizeRoles("ADMIN", "USER"),
  updateAccount
);

/**
 * @swagger
 * /accounts/{id}:
 *   delete:
 *     summary: Delete an existing Finance account
 *     description: This route requires authentication.
 *     tags: [Accounts]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the account to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       404:
 *         description: Account not found
 *       500:
 *         description: Server error
 * */
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("ADMIN", "USER"),
  deleteAccount
);

export default router;

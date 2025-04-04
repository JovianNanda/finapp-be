import { Router } from "express";
import {
  getAccounts,
  getAccountById,
  createAccount,
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
  authorizeRoles("ADMIN", { USER: { strict: true } }),
  getAccountById
);

/**
 * @swagger
 * /accounts/create:
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
router.post("/create", verifyToken, createAccount);

export default router;

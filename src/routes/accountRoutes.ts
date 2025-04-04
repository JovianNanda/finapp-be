import { Router } from "express";
import {
  getAccounts,
  getAccountById,
  createAccount,
} from "../controllers/accountController";

const router = Router();

/**
 * @swagger
 * /accounts:
 *   get:
 *     summary: Get all accounts
 *     tags: [Accounts]
 *     responses:
 *       200:
 *         description: List of accounts
 *
 *       500:
 *         description: Server error
 */
router.get("/", getAccounts);

/**
 * @swagger
 * /accounts/{id}:
 *   get:
 *     summary: Get account by ID
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
router.get("/:id", getAccountById);

/**
 * @swagger
 * /accounts/create:
 *   post:
 *     summary: Create a new account
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
router.post("/create", createAccount);

export default router;

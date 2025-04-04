import express from "express";
import {
  login,
  register,
  logout,
  refreshToken,
} from "../controllers/authController";
import { verifyToken } from "../middlewares/verifyToken";

const router = express.Router();

// 📌 Public Routes

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 */
router.post("/register", register); // Register a new user

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login and receive access & refresh tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", login); // Login and receive tokens

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh expired access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: your_refresh_token_here
 *     responses:
 *       200:
 *         description: New access token generated
 *       403:
 *         description: Invalid refresh token
 */
router.post("/refresh", refreshToken); // Refresh expired access token

// 📌 Protected Route (Logout)
router.post("/logout", verifyToken, logout); // Logout & clear cookies

export default router;

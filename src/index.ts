import express, { Express, Response, Request } from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import accountRoutes from "./routes/accountRoutes";
import { setupSwagger } from "./config/swagger";
import cookieParser from "cookie-parser";
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/api", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to the Finapp API!",
    status: "API is running",
    version: "1.0.0",
    documentation: "http://localhost:5000/api/api-docs",
  });
});
app.use("/api/users", userRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/auth", authRoutes);

// Setup Swagger API documentation
setupSwagger(app);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

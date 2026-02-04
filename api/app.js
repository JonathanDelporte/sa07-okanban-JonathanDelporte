import cors from "cors";
import { xss } from "express-xss-sanitizer";
import "dotenv/config";
import express from "express";
import { authenticate, errorHandler } from "./middlewares/common.middleware.js";
import listRoutes from "./routes/list.routes.js";
import cardRoutes from "./routes/card.routes.js";
import tagRoutes from "./routes/tag.routes.js";
import authRoutes from "./routes/auth.routes.js";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
//Permet que notre navigateur puisse contacter notre API
app.use(cors());

// Permet de proteger notre API contre le XSS
app.use(xss());

app.use("/auth", authRoutes);

// On ajoute notre middleware d'authentification
app.use(authenticate);

app.use("/lists", listRoutes);
app.use("/cards", cardRoutes);
app.use("/tags", tagRoutes);

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
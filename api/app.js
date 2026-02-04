import { xss } from "express-xss-sanitizer";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { authenticate, errorHandler } from "./middlewares/common.middleware.js";
import listRoutes from "./routes/list.routes.js";
import cardRoutes from "./routes/card.routes.js";
import tagRoutes from "./routes/tag.routes.js";
import authRoutes from "./routes/auth.routes.js";


const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
// permet à notre navigateur de contacter notre API

app.use(xss());
// Permet de protéger notre API contre le XSS

app.use(express.json());

app.use("/auth", authRoutes);
// on ajoute notre middleware d'authentification
app.use(authenticate);

app.use("/lists", listRoutes);
app.use("/cards", cardRoutes);
app.use("/tags", tagRoutes);


app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

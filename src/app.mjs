import express from "express";
import cors from "cors";
import path from "path";
import aiRoutes from "./routes/ai-routes.mjs";
import authRoutes from "./routes/auth-routes.mjs";
import recipeRoutes from "./routes/recipe-routes.mjs";
import usageRoutes from "./routes/usage-routes.mjs";
import { errorHandler } from "./middlewares/error-handler.mjs";
import { notFoundHandler } from "./middlewares/not-found.mjs";

export function createApp({ staticDir }) {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.static(staticDir));

  app.get("/api/health", (req, res) => {
    res.json({
      ok: true
    });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/recipes", recipeRoutes);
  app.use("/api/usage", usageRoutes);
  app.use("/api", aiRoutes);

  app.use("/api", notFoundHandler);

  app.get("*", (req, res) => {
    res.sendFile(path.join(staticDir, "index.html"));
  });

  app.use(errorHandler);

  return app;
}

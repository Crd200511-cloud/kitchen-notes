import { Router } from "express";
import { getAiUsage } from "../controllers/usage-controller.mjs";

const router = Router();

router.get("/ai", getAiUsage);

export default router;

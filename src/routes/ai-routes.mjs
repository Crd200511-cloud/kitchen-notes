import { Router } from "express";
import { parseRecipe } from "../controllers/ai-controller.mjs";

const router = Router();

router.post("/parse-recipe", parseRecipe);

export default router;

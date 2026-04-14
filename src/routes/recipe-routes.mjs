import { Router } from "express";
import {
  getRecipe,
  getRecipes,
  patchRecipe,
  postRecipe,
  removeRecipe
} from "../controllers/recipe-controller.mjs";

const router = Router();

router.get("/", getRecipes);
router.get("/:id", getRecipe);
router.post("/", postRecipe);
router.patch("/:id", patchRecipe);
router.delete("/:id", removeRecipe);

export default router;

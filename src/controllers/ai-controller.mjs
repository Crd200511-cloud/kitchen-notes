import { parseRecipeWithAi } from "../services/ai-service.mjs";

export async function parseRecipe(req, res, next) {
  try {
    const result = await parseRecipeWithAi(req.body || {});
    res.json(result);
  } catch (error) {
    next(error);
  }
}

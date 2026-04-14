import {
  createRecipe,
  deleteRecipe,
  getRecipeById,
  listRecipes,
  updateRecipe
} from "../services/recipe-service.mjs";

export async function getRecipes(req, res, next) {
  try {
    const result = await listRecipes(req.query || {});
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getRecipe(req, res, next) {
  try {
    const result = await getRecipeById(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function postRecipe(req, res, next) {
  try {
    const result = await createRecipe(req.body || {});
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function patchRecipe(req, res, next) {
  try {
    const result = await updateRecipe(req.params.id, req.body || {});
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function removeRecipe(req, res, next) {
  try {
    const result = await deleteRecipe(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

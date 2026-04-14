import { HttpError } from "../utils/http-error.mjs";

export async function listRecipes() {
  return {
    items: [],
    total: 0
  };
}

export async function getRecipeById(id) {
  if (!id) {
    throw new HttpError(400, "missing_recipe_id", "需要食谱 id");
  }

  throw new HttpError(501, "not_implemented", "食谱详情接口骨架已创建，待接入数据库");
}

export async function createRecipe(payload) {
  if (!payload?.title) {
    throw new HttpError(400, "missing_title", "创建食谱时需要 title");
  }

  throw new HttpError(501, "not_implemented", "创建食谱接口骨架已创建，待接入数据库");
}

export async function updateRecipe(id, payload) {
  if (!id) {
    throw new HttpError(400, "missing_recipe_id", "更新食谱时需要 id");
  }

  if (!payload?.title) {
    throw new HttpError(400, "missing_title", "更新食谱时需要 title");
  }

  throw new HttpError(501, "not_implemented", "更新食谱接口骨架已创建，待接入数据库");
}

export async function deleteRecipe(id) {
  if (!id) {
    throw new HttpError(400, "missing_recipe_id", "删除食谱时需要 id");
  }

  throw new HttpError(501, "not_implemented", "删除食谱接口骨架已创建，待接入数据库");
}

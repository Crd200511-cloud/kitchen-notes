import { getAiUsageSummary } from "../services/usage-service.mjs";

export async function getAiUsage(req, res, next) {
  try {
    const result = await getAiUsageSummary();
    res.json(result);
  } catch (error) {
    next(error);
  }
}

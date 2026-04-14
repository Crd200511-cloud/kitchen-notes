import { createSessionFromAccessToken } from "../services/auth-service.mjs";

export async function createSession(req, res, next) {
  try {
    const result = await createSessionFromAccessToken(req.body?.accessToken);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

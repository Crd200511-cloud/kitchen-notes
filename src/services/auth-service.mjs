import { HttpError } from "../utils/http-error.mjs";

export async function createSessionFromAccessToken(accessToken) {
  if (!accessToken) {
    throw new HttpError(400, "missing_access_token", "需要 Supabase access token");
  }

  return {
    user: {
      id: "todo-user-id",
      email: "todo@example.com",
      nickname: "待接入 Supabase Auth"
    }
  };
}

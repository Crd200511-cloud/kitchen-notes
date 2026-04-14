import { HttpError } from "../utils/http-error.mjs";

export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    next(error);
    return;
  }

  const status = error instanceof HttpError ? error.status : 500;
  const code = error instanceof HttpError ? error.code : "internal_error";
  const detail = error instanceof Error ? error.message : "服务器发生未知错误";

  if (status >= 500) {
    console.error(error);
  }

  res.status(status).json({
    error: code,
    detail
  });
}

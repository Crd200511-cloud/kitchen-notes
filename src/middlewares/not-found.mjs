export function notFoundHandler(req, res) {
  res.status(404).json({
    error: "not_found",
    detail: "请求的接口不存在"
  });
}

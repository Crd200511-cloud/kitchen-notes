export function detectPlatform(url = "") {
  const value = String(url).toLowerCase();

  if (value.includes("xiaohongshu")) {
    return "小红书";
  }

  if (value.includes("douyin") || value.includes("iesdouyin")) {
    return "抖音";
  }

  return "";
}

export function normalizeLines(text = "") {
  return String(text)
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function parseModelJson(response) {
  if (response.output_text) {
    return JSON.parse(response.output_text);
  }

  const textParts =
    response.output
      ?.flatMap((item) => item.content || [])
      .filter((item) => item.type === "output_text" && item.text)
      .map((item) => item.text) || [];

  if (!textParts.length) {
    throw new Error("模型没有返回可解析文本");
  }

  return JSON.parse(textParts.join(""));
}

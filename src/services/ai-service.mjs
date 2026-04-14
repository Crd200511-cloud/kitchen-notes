import OpenAI from "openai";
import { env } from "../config/env.mjs";
import { HttpError } from "../utils/http-error.mjs";
import { detectPlatform, normalizeLines, parseModelJson } from "../utils/recipe-import.mjs";

let client = null;

function getClient() {
  if (!env.openaiApiKey) {
    throw new HttpError(
      500,
      "missing_api_key",
      "服务端未配置 OPENAI_API_KEY，请先在本机 .env 或环境变量里设置。"
    );
  }

  if (!client) {
    client = new OpenAI({ apiKey: env.openaiApiKey });
  }

  return client;
}

export async function parseRecipeWithAi({ rawText = "", sourceUrl = "", mode = "note" }) {
  if (!rawText && !sourceUrl) {
    throw new HttpError(400, "missing_input", "需要原文或链接");
  }

  const cleanedLines = normalizeLines(rawText).slice(0, 200);
  const response = await getClient().responses.create({
    model: env.openaiModel,
    reasoning: {
      effort: "low"
    },
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text:
              "你是一个中文食谱结构化助手。请从用户提供的笔记、分享文案或口语教程整理中提取菜名、材料、做法步骤和备注。不要编造具体食材数量、步骤或时间；不确定的信息放进 notes 或 unresolved。步骤要尽量拆细，但不要凭空新增不存在的步骤。"
          }
        ]
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `导入类型：${mode}\n来源链接：${sourceUrl}\n来源平台：${detectPlatform(
              sourceUrl
            )}\n\n原文如下：\n${cleanedLines.join("\n")}`
          }
        ]
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "recipe_extract",
        strict: true,
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            title: { type: "string" },
            sourceUrl: { type: "string" },
            ingredients: {
              type: "array",
              items: { type: "string" }
            },
            steps: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                properties: {
                  title: { type: "string" },
                  detail: { type: "string" },
                  duration: { type: "string" },
                  tip: { type: "string" }
                },
                required: ["title", "detail", "duration", "tip"]
              }
            },
            notes: { type: "string" },
            unresolved: {
              type: "array",
              items: { type: "string" }
            }
          },
          required: ["title", "sourceUrl", "ingredients", "steps", "notes", "unresolved"]
        }
      }
    }
  });

  return parseModelJson(response);
}

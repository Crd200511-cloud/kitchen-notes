export const env = {
  host: process.env.HOST || "127.0.0.1",
  port: Number(process.env.PORT || 3000),
  openaiModel: process.env.OPENAI_MODEL || "gpt-5.4-mini",
  openaiApiKey: process.env.OPENAI_API_KEY || ""
};

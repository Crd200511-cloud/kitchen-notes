import path from "path";
import { fileURLToPath } from "url";
import { createApp } from "./src/app.mjs";
import { env } from "./src/config/env.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = createApp({ staticDir: __dirname });

app.listen(env.port, env.host, () => {
  console.log(`Kitchen Notes running at http://${env.host}:${env.port}`);
});

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import ky from "ky";
import dotenv from "dotenv";

dotenv.config();

const app = new Hono().basePath("/api");

// 미들웨어 설정
app.use("*", async (c, next) => {
  console.log(`[${new Date().toISOString()}] ${c.req.method} ${c.req.url}`);
  await next();
});

// 라우트 설정
app.get("/", (c) => {
  return c.json({
    message: "Hello from Hono!",
  });
});

app.post("/token", async (c) => {
  const { code } = await c.req.json();
  const { access_token } = await ky
    .post("https://discord.com/api/oauth2/token", {
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        grant_type: "authorization_code",
        code,
      }),
    })
    .json<any>();
  return c.json({ access_token });
});

// 서버 시작
const port = 1945;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

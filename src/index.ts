import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

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

// 서버 시작
const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

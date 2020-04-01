const Router = require("koa-router");

const router = new Router();

router.get("/", async (ctx, next) => {
  ctx.ok("hello world");
  await next();
});

module.exports = router;

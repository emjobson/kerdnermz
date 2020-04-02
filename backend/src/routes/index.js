const Router = require("koa-router");

const game = require("./game");

const router = new Router();

router.get("/", async (ctx, next) => {
  ctx.ok("hello world");
  await next();
});

router.use("/game", game.routes());

module.exports = router;

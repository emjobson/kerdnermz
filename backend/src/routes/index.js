const Router = require("koa-router");

const game = require("./game");
const wordBankRouter = require("./wordbank");

const router = new Router();

router.get("/", async (ctx, next) => {
  ctx.ok("hello world");
  await next();
});

router.use("/game", game.routes());
router.use("/word-bank", wordBankRouter.routes());

module.exports = router;

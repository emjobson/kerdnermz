const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const logger = require("koa-logger");
const respond = require("koa-respond");
const router = require("./routes");

const PORT = 5000;

const app = new Koa();

app
  .use(logger())
  .use(respond())
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});

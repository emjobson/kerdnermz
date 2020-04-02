const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const logger = require("koa-logger");
const respond = require("koa-respond");
const cors = require("@koa/cors");
const router = require("./routes");

require("dotenv").config();

const { PORT } = process.env;

const app = new Koa();

app
  .use(cors())
  .use(logger())
  .use(respond())
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});

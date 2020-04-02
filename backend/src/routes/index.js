const Router = require("koa-router");
const Scaledrone = require("scaledrone-node");
require("dotenv").config();

const { SCALEDRONE_CHANNEL_ID } = process.env;

const router = new Router();
const drone = new Scaledrone(SCALEDRONE_CHANNEL_ID);

router.get("/", async (ctx, next) => {
  ctx.ok("hello world");
  await next();
});

/*
 * User was first in room "roomID". Publish initial game state to
 * that room.
 */
router.get("/new-game/:roomID", async (ctx, next) => {
  const { roomID } = ctx.params;
  // If no room with that ID exists, publish board to that room
  const board = "THIS IS THE FAKE BOARD FROM SERVER";
  drone.publish({
    room: `observable-${roomID}`,
    message: board,
  });

  ctx.ok("howdy ho");
  await next();
});

module.exports = router;

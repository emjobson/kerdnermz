const Router = require("koa-router");
const Scaledrone = require("scaledrone-node");
require("dotenv").config();

const { SCALEDRONE_CHANNEL_ID } = process.env;
const drone = new Scaledrone(SCALEDRONE_CHANNEL_ID);
const wordBankRouter = new Router();

wordBankRouter.get("/", async (ctx, next) => {
  ctx.ok("word bank");
  await next();
});

/**
 * Adds the given word, if eligible, to the room's word bank.
 * @request_params
 *   @param {String} roomID id of game in progress (without "observable" prefix)
 *
 * @request_body
 *   @param {String} newWord new word to add to the current word bank
 */
game.put("/:roomID", async (ctx, next) => {
  const { roomID } = ctx.params;
  const {
    roomState,
    roomState: { wordBank },
    newWord,
  } = ctx.request.body;

  // Don't add null or empty words.
  if (!newWord || newWord.length === 0) {
    await next();
    return;
  }

  wordBank.allWords.push(newWord);

  drone.publish({
    room: `observable-${roomID}`,
    message: { ...roomState, wordBank },
  });
  ctx.ok();
  await next();
});

module.exports = wordBankRouter;

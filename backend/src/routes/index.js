const Router = require("koa-router");
const Scaledrone = require("scaledrone-node");
require("dotenv").config();

const { SCALEDRONE_CHANNEL_ID } = process.env;

const { game, shuffle, createTiles } = require("./game");

const router = new Router();
const drone = new Scaledrone(SCALEDRONE_CHANNEL_ID);

router.use("/game", game.routes());

/**
 * Initializes and publishes initial room state (game, wordBank, page) to
 * game specified by roomID.
 * @request_params
 *   @param {String} roomID room identifier
 */
router.get("/:roomID", async (ctx, next) => {
  const { roomID } = ctx.params;
  // TODO(regina): Create constants for number of cards per type.
  const numBlueCards = 3;
  const numRedCards = numBlueCards - 1;

  // TODO(regina): Get actual clues.
  const clues = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  shuffle(clues);

  // Set up tiles.
  let tiles = [];
  tiles = tiles.concat(createTiles(clues.splice(0, numBlueCards), "blue"));
  tiles = tiles.concat(createTiles(clues.splice(0, numRedCards), "red"));
  tiles = tiles.concat(createTiles(clues.splice(0, 1), "death"));
  tiles = tiles.concat(createTiles(clues, "neutral"));
  shuffle(tiles);

  // TODO(regina): Create constants for tile types and teams.
  const newGame = {
    tiles,
    currentTurn: "blue",
    winner: "",
  };

  const newWordBank = {
    allWords: [],
  };

  drone.publish({
    room: `observable-${roomID}`,
    message: { game: newGame, wordBank: newWordBank, page: "game" },
  });

  ctx.ok();
  await next();
});

module.exports = router;

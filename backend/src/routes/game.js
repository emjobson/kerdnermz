const Router = require("koa-router");
const Scaledrone = require("scaledrone-node");
require("dotenv").config();

const { SCALEDRONE_CHANNEL_ID } = process.env;
const drone = new Scaledrone(SCALEDRONE_CHANNEL_ID);
const game = new Router();

/**
 * Shuffles array in place. From https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array.
 * @param {Array} a An array containing the items.
 */
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Returns an array of board tiles with the given type.
 * @param {Array} clues An array of clue words to display on the tiles.
 * @param {String} type A string indicating tile type. Should be "blue," "red,"
 * "death," or "neutral."
 */
function createTiles(clues, type) {
  const tiles = [];
  clues.forEach((clue) => {
    tiles.push({
      clue,
      type,
      revealed: false,
    });
  });

  return tiles;
}
/**
 * Returns number of tiles remaining for team to find.
 * @param {Array} tiles Array of board's tile objects.
 * @param {String} team A string indicating tile type. Should be "blue" or "red".
 */
function getNumRemainingTiles(tiles, team) {
  return tiles.filter((tile) => !tile.revealed && tile.type === team).length;
}

/**
 * Updates game state according to clicked tile, and publishes result to Scaledrone room.
 * If already clicked, ignore. If death clicked, declare winner.
 * Otherwise, update clicked tile, turn, and winner as necessary.
 * @request_params
 *   @param {String} roomID id of game in progress (without "observable" prefix)
 *
 * @request_body
 *   @param {Object} roomState  object with keys: "game," "wordBank," and "page"
 *   @param {Number} idx index of clicked tile in game.tiles
 */
game.put("/:roomID", async (ctx, next) => {
  const { roomID } = ctx.params;
  const {
    roomState,
    roomState: { game },
    idx,
  } = ctx.request.body;
  const { tiles, currentTurn, winner } = game;
  const currentOpponent = currentTurn === "blue" ? "red" : "blue";

  // ignore already clicked or game finished
  if (tiles[idx].revealed || winner) {
    ctx.ok();
    await next();
    return;
  }

  const newGame = { ...game };
  newGame.tiles[idx].revealed = true;

  if (newGame.tiles[idx].type === "death") {
    newGame.winner = currentOpponent;
    drone.publish({
      room: `observable-${roomID}`,
      message: { ...roomState, game: newGame },
    });
    ctx.ok();
    await next();
    return;
  }

  // check if winner
  const redRemaining = getNumRemainingTiles(tiles, "red");
  const blueRemaining = getNumRemainingTiles(tiles, "blue");
  if (redRemaining === 0 || blueRemaining === 0) {
    newGame.winner = redRemaining === 0 ? "red" : "blue";
    drone.publish({
      room: `observable-${roomID}`,
      message: { ...roomState, game: newGame },
    });
    ctx.ok();
    await next();
    return;
  }

  // if clicked other team or neutral, flip turn
  if (newGame.tiles[idx].type !== currentTurn) {
    newGame.currentTurn = currentOpponent;
  }

  drone.publish({
    room: `observable-${roomID}`,
    message: { ...roomState, game: newGame },
  });
  ctx.ok();
  await next();
});

module.exports = { game, shuffle, createTiles };

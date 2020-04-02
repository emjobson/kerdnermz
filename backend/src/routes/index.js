const Router = require("koa-router");

const router = new Router();

router.get("/", async (ctx, next) => {
  ctx.ok("hello world");
  await next();
});

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
 * @param {Array} randomizedClueIndices An array of randomly ordered indices for
 * the clues array.
 * @param {String} type A string indicating tile type. Should be "blue," "red,"
 * "death," or "neutral."
 */
function createTiles(clues, randomizedClueIndices, type) {
  const tiles = [];
  randomizedClueIndices.forEach((clueIndex) => {
    tiles.push({
      clue: clues[clueIndex],
      type,
      revealed: false,
    });
  });

  return tiles;
}

router.get("/new-game", async (ctx, next) => {
  // TODO(regina): Create constants for number of cards per type.
  const numBlueCards = 3;
  const numRedCards = numBlueCards - 1;

  // TODO(regina): Get actual clues.
  const clues = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const randomizedClueIndices = Array.from(Array(clues.length).keys());
  shuffle(randomizedClueIndices);

  // We add tiles in order of blue, red, death, and then the remaining clues are
  // added as neutral. Because the order of the clues we add have been
  // randomized, the tile types are also randomized across the board.
  let tiles = [];
  tiles = tiles.concat(
    createTiles(clues, randomizedClueIndices.splice(0, numBlueCards), "blue")
  );
  tiles = tiles.concat(
    createTiles(clues, randomizedClueIndices.splice(0, numRedCards), "red")
  );
  tiles = tiles.concat(
    createTiles(clues, randomizedClueIndices.splice(0, 1), "death")
  );
  tiles = tiles.concat(createTiles(clues, randomizedClueIndices, "neutral"));

  // TODO(regina): Create constants for tile types and teams.
  const newGame = {
    tiles,
    currentTurn: "blue",
    winner: "",
  };
  ctx.ok(newGame);
  await next();
});

module.exports = router;

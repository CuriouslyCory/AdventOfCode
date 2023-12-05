import path from "path";
//import util from "util";
import { readFileContent } from "../utils/fs-helper";

const inputFilePath = path.join(__dirname, `./input.txt`);
const getInput = async () => {
  return (await readFileContent(inputFilePath)).split("\n");
};

// format the input data into a more usable format
const parseGameInput = async () => {
  const input = await getInput();
  const games = input.map((line) => {
    const gameAry = line.split(":");
    // get the game id
    const gameId = parseInt(gameAry.shift()?.split(" ")[1] ?? "0");
    // deconstruct the draw data
    const drawData = gameAry[0].split(";").map((drawSet) => {
      const draws = drawSet
        .trim()
        .split(",")
        .map((res) => {
          const cubes = res.trim().split(" ");
          return { [cubes[1]]: parseInt(cubes[0]) };
        })
        .reduce((acc, curr) => {
          return { ...acc, ...curr };
        }, {});
      return draws;
    });

    return { gameId, drawData };
  });
  return games;
};

// what is the sum of all game ids that are possible
const part1 = async () => {
  const constraints = { red: 12, green: 13, blue: 14 } as const;
  const games = await parseGameInput();

  // if any draw has more of a color than the constraint, log the game id
  let possibleGames = Array<number>(),
    impossibleGames = [];
  for (const game of games) {
    if (
      game.drawData.some((draw) => {
        return Object.keys(draw).some((color) => {
          return draw[color] > constraints[color as keyof typeof constraints];
        });
      })
    ) {
      impossibleGames.push(game.gameId);
    } else {
      possibleGames.push(game.gameId);
    }
  }
  return possibleGames.reduce((acc, curr) => acc + curr, 0);
};

// what is the fewest number of cubes of each color that could have been in the bag to make the game possible?
const part2 = async () => {
  //const constraints = { red: 12, green: 13, blue: 14 } as const;
  const games = await parseGameInput();

  const gameMinCubes = games.map((game) => {
    const { minRed, minGreen, minBlue } = game.drawData.reduce(
      (acc, curr) => {
        return {
          minRed: Math.max(acc.minRed, curr.red ?? 0),
          minGreen: Math.max(acc.minGreen, curr.green ?? 0),
          minBlue: Math.max(acc.minBlue, curr.blue ?? 0),
        };
      },
      { minRed: 0, minGreen: 0, minBlue: 0 }
    );
    return { gameId: game.gameId, minRed, minGreen, minBlue };
  });

  // The power of a set of cubes is equal to the numbers of red, green, and blue cubes multiplied together.
  const powers = gameMinCubes.map((game) => {
    return game.minRed * game.minGreen * game.minBlue;
  });

  // Adding up these powers gives us the answer.
  return powers.reduce((acc, curr) => acc + curr, 0);
};

export { part1, part2 };

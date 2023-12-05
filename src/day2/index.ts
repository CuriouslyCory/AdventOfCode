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
      console.log("impossible", game);
    } else {
      possibleGames.push(game.gameId);
      console.log("possible", game);
    }
  }
  return possibleGames.reduce((acc, curr) => acc + curr, 0);
};

const part2 = async () => {};

export { part1, part2 };

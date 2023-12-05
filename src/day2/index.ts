import path from "path";
import { readFileContent } from "../utils/fs-helper";

const inputFilePath = path.join(__dirname, `./input.txt`);
const getInput = async () => {
  return (await readFileContent(inputFilePath)).split("\n");
};

const part1 = async () => {
  const input = await getInput();
};

const part2 = async () => {};

export { part1, part2 };

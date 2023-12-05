import path from "path";
import { readFileContent } from "../utils/fs-helper";

const inputFilePath = path.join(__dirname, `./input.txt`);
const getInput = async () => {
  return await readFileContent(inputFilePath);
};

const part1 = async () => {
  const input = await getInput();
  // split the input into an array of lines
  const lines = input.split("\n");

  // array reduce to sum the first and last digits of each line
  const sum = lines.reduce((acc, line) => {
    // grab just the Numbers
    const numbers = line
      .split("")
      .map(Number)
      .filter((n) => !isNaN(n));
    const concatenated =
      numbers[0].toString() + numbers[numbers.length - 1].toString();
    return acc + parseInt(concatenated);
  }, 0);

  return sum;
};

// create a map of string numbers to numbers
const numberMap = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
} as const;

// match for all valid "numbers"
const numMatch =
  /0|1|2|3|4|5|6|7|8|9|one|two|three|four|five|six|seven|eight|nine/gi;

// string replace any string numbers with numbers
function replaceStringNumberWithNumber(input: string) {
  let match,
    res = [];
  // regex is greedy and will ignore the next match if it is part of the first match, e.g. "oneight" would ignore "eight"
  // so we need to reset the index to the next character after the first match
  while ((match = numMatch.exec(input))) {
    numMatch.lastIndex = match.index + 1;
    res.push(
      !isNaN(parseInt(match[0]))
        ? parseInt(match[0])
        : numberMap[match[0].toLowerCase() as keyof typeof numberMap]
    );
  }
  return res;
}

const part2 = async () => {
  const input = await getInput();
  // split the input into an array of lines
  const lines = input.split("\n");

  // array reduce to sum the first and last digits of each line
  const sum = lines.reduce((acc, line) => {
    // convert number strings to numbers and grab just the Numbers
    const replacedLine = replaceStringNumberWithNumber(line);
    const numbers = replacedLine;
    const concatenated =
      numbers[0].toString() + numbers[numbers.length - 1].toString();
    return acc + parseInt(concatenated);
  }, 0);

  return sum;
};

export { part1, part2 };

import path from "path";
import { readFileContent } from "../utils/fs-helper";
//import { z } from "zod";

const inputFilePath = path.join(__dirname, `./input.txt`);
const getInput = async () => {
  return (await readFileContent(inputFilePath))
    .split("\n")
    .map((line) => line.split(""));
};

const getKernel = (
  input: Array<Array<string>>,
  rowNum: number,
  colNum: number
) => {
  const kernel = [];
  for (let i = rowNum - 1; i <= rowNum + 1; i++) {
    for (let j = colNum - 1; j <= colNum + 1; j++) {
      kernel.push(input?.[i]?.[j]);
    }
  }
  return kernel.flat();
};

const symbolRegex = /[^0-9a-zA-Z.]/g;

const getNumberSequence = (input: Array<string>, colNum: number) => {
  const sequence = [];
  let i = colNum;

  // rewind until the first non-number character
  for (i; i < input.length; i--) {
    if (isNaN(Number(input[i]))) {
      break;
    }
  }
  // advance to the first number character
  const startPos = i++;

  // get the number sequence
  for (i; i < input.length; i++) {
    if (isNaN(Number(input[i]))) {
      break;
    }
    sequence.push(input[i]);
  }
  const endPos = i--;
  return {
    value: parseInt(sequence.join("")),
    length: sequence.length,
    startPos,
    endPos,
  };
};

// identify sequences of numbers not adjacent to any symbol other than . in the matrix
const part1 = async () => {
  const input = await getInput();
  let partSum = 0;
  for (let rowNum = 0; rowNum < input.length; rowNum++) {
    for (let colNum = 0; colNum < input[rowNum].length; colNum++) {
      if (!isNaN(Number(input[rowNum][colNum]))) {
        const kernel = getKernel(input, rowNum, colNum);
        const kernelString = kernel.join("");
        if (kernelString.match(symbolRegex)) {
          const sequence = getNumberSequence(input[rowNum], colNum);
          colNum = sequence.endPos;
          partSum += sequence.value;
        }
      }
    }
  }
  return partSum;
};

const numberRegex = /\d+/g;
//const numSchema = z.number();

// 0 - 3 is row -1 '... '
// 4 - 7 is row +0 '*** '
// 7 - 10 is row +1 '...'
const getRelativeCoordsFromKernelStringIndex = (index: number) => {
  const row = Math.floor(index / 4) - 1;
  const col = (index % 4) - 1;
  return { row, col };
};

const part2 = async () => {
  const input = await getInput();
  let partSum = 0;
  for (let rowNum = 0; rowNum < input.length; rowNum++) {
    for (let colNum = 0; colNum < input[rowNum].length; colNum++) {
      if (input[rowNum][colNum] === "*") {
        const kernel = getKernel(input, rowNum, colNum);
        // format kernel into a string where groups of numbers can be matched
        const kernelString = `${kernel.slice(0, 3).join("")} ${kernel
          .slice(3, 6)
          .join("")} ${kernel.slice(6, 9).join("")} `;
        const match = Array.from(kernelString.matchAll(numberRegex));
        // two matches is valid input
        if (match.length == 2) {
          const gearRatio = [];
          // get the full number sequence for each match
          for (const m of match) {
            if (!m || typeof m.index === "undefined") {
              console.log("match", match);
              throw new Error("Invalid match something screwy is going on");
            }
            const { row: rowOffset, col: colOffset } =
              getRelativeCoordsFromKernelStringIndex(m.index);
            const sequence = getNumberSequence(
              input[rowNum + rowOffset],
              colNum + colOffset
            );
            gearRatio.push(sequence.value);
          }
          // multiply to find the gear ratio and add to sum
          partSum += gearRatio[0] * gearRatio[1];
        }
      }
    }
  }
  return partSum;
};

export { part1, part2 };

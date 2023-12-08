import path from "path";
import { readFileContent } from "../utils/fs-helper";

type Card =
  | "A"
  | "K"
  | "Q"
  | "J"
  | "T"
  | "9"
  | "8"
  | "7"
  | "6"
  | "5"
  | "4"
  | "3"
  | "2";

// card values in order of strength
const cardsAry: Array<Card> = [
  "A",
  "K",
  "Q",
  "J",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
];

type Hand = {
  cards: Array<Card>;
  bid: number;
};

const inputFilePath = path.join(__dirname, `./input.txt`);
const getInput = async (): Promise<Array<Hand>> => {
  return (await readFileContent(inputFilePath)).split("\n").map((line) => {
    const [hand, bid] = line.split(" ");
    return {
      cards: hand.split("") as Array<Card>,
      bid: parseInt(bid),
    };
  });
};

// patterns
// Five of a kind, where all five cards have the same label: AAAAA
// Four of a kind, where four cards have the same label and one card has a different label: AA8AA
// Full house, where three cards have the same label, and the remaining two cards share a different label: 23332
// Three of a kind, where three cards have the same label, and the remaining two cards are each different from any other card in the hand: TTT98
// Two pair, where two cards share one label, two other cards share a second label, and the remaining card has a third label: 23432
// One pair, where two cards share one label, and the other three cards have a different label from the pair and each other: A23A4
// High card, where all cards' labels are distinct: 23456

function handStrength(cards: Array<Card>) {
  const ordered = [...cards].sort(
    (a, b) => cardsAry.indexOf(b) - cardsAry.indexOf(a)
  );
  switch (true) {
    case ordered[0] === ordered[4]: // five of a kind
      return 6;
    case ordered[0] === ordered[3] || ordered[1] === ordered[4]: // four of a kind
      return 5;
    case ordered[0] === ordered[2] && ordered[3] === ordered[4]: // full house
      return 4;
    case ordered[0] === ordered[2] || // three of a kind
      ordered[1] === ordered[3] ||
      ordered[2] === ordered[4]:
      return 3;
    case ordered[0] === ordered[1] && ordered[2] === ordered[3]: // two pair
      return 2;
    case ordered[0] === ordered[1] || // one pair
      ordered[1] === ordered[2] ||
      ordered[2] === ordered[3] ||
      ordered[3] === ordered[4]:
      return 1;
    default: // high card
      return 0;
  }
}

// sort hands according to strength
function handStrengthSort(a: Array<Card>, b: Array<Card>) {
  // Compare hand strengths first
  const strengthA = handStrength(a);
  const strengthB = handStrength(b);

  if (strengthB !== strengthA) {
    return strengthB - strengthA;
  }

  // If hand strengths are the same, compare individual card strengths
  for (let i = 0; i < a.length; i++) {
    const cardAStrength = cardsAry.indexOf(a[i]);
    const cardBStrength = cardsAry.indexOf(b[i]);

    if (cardAStrength !== cardBStrength) {
      return cardAStrength - cardBStrength;
    }
  }

  // If all cards are the same strength
  return 0;
}

async function part1() {
  const input = await getInput();
  input.sort((a, b) => handStrengthSort(a.cards, b.cards)).reverse();
  return input.reduce((acc, hand, currentIndex) => {
    const rank = currentIndex + 1;
    console.log(acc, hand, rank, hand.bid * rank);
    return acc + hand.bid * rank;
  }, 0);
}

async function part2() {
  const input = await getInput();
}

export { part1, part2 };

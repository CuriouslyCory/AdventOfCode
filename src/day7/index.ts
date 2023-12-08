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
  rank: number;
  type?: number;
};

// load and format the input
const inputFilePath = path.join(__dirname, `./input.txt`);
const getInput = async (): Promise<Array<Hand>> => {
  return (await readFileContent(inputFilePath)).split("\n").map((line) => {
    const [hand, bid] = line.split(" ");
    return {
      cards: hand.split("") as Array<Card>,
      bid: parseInt(bid),
      rank: 0,
    };
  });
};

// assumes cards are sorted
function hasPair(cards: Array<Card>): boolean {
  while (cards.length > 1) {
    if (cards[0] === cards[1]) {
      return true;
    }
    cards.shift();
  }
  return false;
}

// assumes cards are sorted
function hasTwoPair(cards: Array<Card>): boolean {
  let pairCount = 0;
  while (cards.length > 1) {
    if (cards[0] === cards[1]) {
      pairCount++;
      if (pairCount === 2) return true;
    }
    cards.shift();
  }
  return false;
}

// Hand strength patterns
// Five of a kind, where all five cards have the same label: AAAAA
// Four of a kind, where four cards have the same label and one card has a different label: AA8AA
// Full house, where three cards have the same label, and the remaining two cards share a different label: 23332
// Three of a kind, where three cards have the same label, and the remaining two cards are each different from any other card in the hand: TTT98
// Two pair, where two cards share one label, two other cards share a second label, and the remaining card has a third label: 23432
// One pair, where two cards share one label, and the other three cards have a different label from the pair and each other: A23A4
// High card, where all cards' labels are distinct: 23456
function handStrength(cards: Array<Card>) {
  // put matching cards next to each other
  const ordered = [...cards].sort(
    (a, b) => cardsAry.indexOf(b) - cardsAry.indexOf(a)
  );
  switch (true) {
    // five of a kind
    case ordered[0] === ordered[4]:
      return 7;
    // four of a kind
    case ordered[0] === ordered[3] || ordered[1] === ordered[4]:
      return 6;
    // full house
    case (ordered[0] === ordered[2] && ordered[3] === ordered[4]) ||
      (ordered[0] === ordered[1] && ordered[2] === ordered[4]):
      return 5;
    // three of a kind
    case ordered[0] === ordered[2] ||
      ordered[1] === ordered[3] ||
      ordered[2] === ordered[4]:
      return 4;
    // two pair
    case hasTwoPair([...ordered]):
      return 3;
    // one pair
    case hasPair([...ordered]):
      return 2;
    // high card
    default:
      return 1;
  }
}

// sort hands according to strength, then by high card
function handStrengthSort(a: Hand, b: Hand) {
  // Compare hand strengths first
  if (!a.type) a.type = handStrength(a.cards);
  if (!b.type) b.type = handStrength(b.cards);
  if (b.type !== a.type) {
    return b.type - a.type;
  }

  // If hand strengths are the same, compare individual card strengths
  for (let i = 0; i < a.cards.length; i++) {
    const cardAStrength = cardsAry.indexOf(a.cards[i]);
    const cardBStrength = cardsAry.indexOf(b.cards[i]);

    if (cardAStrength !== cardBStrength) {
      return cardAStrength - cardBStrength;
    }
  }

  // If all cards are the same strength
  return 0;
}

async function part1() {
  const input = await getInput();
  input.sort((a, b) => handStrengthSort(a, b)).reverse();
  const rankedInput = input.map((hand, index) => {
    return {
      ...hand,
      rank: index + 1,
    };
  });
  console.log(rankedInput);
  return rankedInput.reduce((acc, hand) => {
    console.log(hand, hand.bid * hand.rank);
    return acc + hand.bid * hand.rank;
  }, 0);
  //252409769
  //252196161
  //252262121
  //252118040
  //252052080
}

async function part2() {
  const input = await getInput();
}

export { part1, part2 };

import { ExpressionEvaluator } from "./evaluator";
import { ShuntingYardParser } from "./ShuntingYardParser";
import { ExpressionTokenizer } from "./tokenize";
import { IConstants, IFunction } from "./types";

const functions: IFunction = {
  cos: { args: 1, evaluate: Math.cos },
  sin: { args: 1, evaluate: Math.sin },
  max: { args: 2, evaluate: Math.max },
};

const constants: IConstants = {
  pi: Math.PI,
  e: Math.E,
};

const operators: IFunction = {
  "+": { args: 2, evaluate: (arg1: number, arg2: number) => arg1 + arg2 },
  "-": { args: 2, evaluate: (arg1: number, arg2: number) => arg1 - arg2 },
  "*": { args: 2, evaluate: (arg1: number, arg2: number) => arg1 * arg2 },
  "/": { args: 2, evaluate: (arg1: number, arg2: number) => arg1 / arg2 },
  "^": { args: 2, evaluate: (arg1: number, arg2: number) => arg1 ** arg2 },
  "~": { args: 1, evaluate: (arg: number) => -arg }, // унарный минус
};

try {
  const parser = new ShuntingYardParser(functions);

  const tokenizer = new ExpressionTokenizer({
    functions: Object.keys(functions),
    constants: Object.keys(constants),
  });

  console.log(parser.parse(tokenizer.tokenize("8 * (-1 + 2) ")));

  // const evaluator = new ExpressionEvaluator({
  //   constants: constants,
  //   functions: functions,
  //   operators: operators,
  // });

  // const result = evaluator.evaluate({ rpn: tokens, variables: { x: 10 } });
} catch (err) {
  if (err instanceof Error) {
    console.log(err);
  }
}

import { ExpressionEvaluator } from "./evaluator";
import { ShuntingYardParser } from "./ShuntingYardParser";
import { ExpressionTokenizer } from "./tokenize";
import {
  IConstants,
  IFunctions,
  IMathOperators,
  IToken,
  IVariables,
} from "./types";

export class ExpressionParser {
  evaluator: ExpressionEvaluator;
  rpn: IToken[];
  variables: IVariables;

  constructor(expression: string) {
    const functions = this.initFunctions();
    const constants = this.initConstant();
    const operators = this.initOperators();

    const tokenizer = new ExpressionTokenizer({
      functions: Object.keys(functions),
      constants: Object.keys(constants),
    });

    this.evaluator = new ExpressionEvaluator({
      constants,
      functions,
      operators,
    });

    const parser = new ShuntingYardParser(functions);

    this.rpn = parser.parse(tokenizer.tokenize(expression));
    this.variables = {};
  }

  setVariables(key: string, value: number) {
    this.variables[key] = value;
  }

  evaluate(): number {
    return this.evaluator.evaluate({
      rpn: this.rpn,
      variables: this.variables,
    });
  }

  initFunctions(): IFunctions {
    return {
      cos: { args: 1, evaluate: Math.cos },
      sin: { args: 1, evaluate: Math.sin },
      max: { args: 2, evaluate: Math.max },
    };
  }

  initConstant(): IConstants {
    return {
      pi: Math.PI,
      e: Math.E,
    };
  }

  initOperators(): IMathOperators {
    return {
      "+": { args: 2, evaluate: (arg1: number, arg2: number) => arg1 + arg2 },
      "-": { args: 2, evaluate: (arg1: number, arg2: number) => arg1 - arg2 },
      "*": { args: 2, evaluate: (arg1: number, arg2: number) => arg1 * arg2 },
      "/": { args: 2, evaluate: (arg1: number, arg2: number) => arg1 / arg2 },
      "^": { args: 2, evaluate: (arg1: number, arg2: number) => arg1 ** arg2 },
      "~": { args: 1, evaluate: (arg: number) => -arg },
    };
  }
}

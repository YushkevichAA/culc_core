import { IFunctions, IConstants, IToken, IVariables } from "./types";

export class ExpressionEvaluator {
  functions: IFunctions;
  constants: IConstants;
  operators: IFunctions;

  constructor({
    functions,
    constants,
    operators,
  }: {
    functions: IFunctions;
    constants: IConstants;
    operators: IFunctions;
  }) {
    this.functions = functions;
    this.constants = constants;
    this.operators = operators;
  }

  evaluate({ rpn, variables }: { rpn: IToken[]; variables: IVariables }) {
    const stack: number[] = [];

    for (const token of rpn) {
      if (token.type === "number") {
        stack.push(parseFloat(token.value));
      } else if (token.type === "constant") {
        this.evaluateConstant(token, stack);
      } else if (token.type === "variable") {
        this.evaluateVariables(token, stack, variables);
      } else if (token.type === "operator") {
        this.evaluateOperators(token, stack);
      } else if (token.type === "function") {
        this.evaluateFunctions(token, stack);
      } else {
        throw new Error(
          `got invalid token "${token.value}" (${token.start}:${token.end})`,
        );
      }
    }

    if (stack.length != 1) {
      throw new Error("expression is invalid");
    }

    return stack[0];
  }

  evaluateConstant(token: IToken, stack: number[]) {
    const constant = this.constants[token.value];
    if (!constant) {
      throw new Error(
        `got unknown constant "${token.value}" (${token.start}:${token.end})`,
      );
    }
    stack.push(constant);
  }

  evaluateVariables(
    token: IToken,
    stack: number[],
    variables: {
      [keyof: string]: number;
    },
  ) {
    const variable = variables[token.value];
    if (!variable) {
      throw new Error(`variable "${token.value}" value is not set`);
    }
    stack.push(variable);
  }

  evaluateOperators(token: IToken, stack: number[]) {
    const operator = this.operators[token.value];

    if (!operator) {
      throw new Error(
        `got unknown operator "${token.value}" (${token.start}:${token.end})`,
      );
    }

    if (stack.length < operator.args) {
      throw new Error(
        `not enough arguments to evaluate operator "${token.value}" (${token.start}:${token.end})`,
      );
    }
    const args = stack.splice(-operator.args);
    stack.push(operator.evaluate(...args));
  }

  evaluateFunctions(token: IToken, stack: number[]) {
    const func = this.functions[token.value];

    if (!func) {
      throw new Error(
        `got unknown function "${token.value}" (${token.start}:${token.end})`,
      );
    }

    if (stack.length < func.args) {
      throw new Error(
        `not enough arguments to evaluate function "${token.value}" (${token.start}:${token.end})`,
      );
    }
    const args = stack.splice(-func.args);
    stack.push(func.evaluate(...args));
  }
}

import {
  IPriorityOperatorsList,
  IOperator,
  IToken,
  TokenType,
  IFunction,
} from "./types";

type TExpect = "operator" | "operand" | "(";

export class ShuntingYardParser {
  operators: IPriorityOperatorsList;
  functions: IFunction;

  constructor(functions: IFunction) {
    this.functions = functions;
    this.operators = {
      "+": { precedence: 1, associative: "left" },
      "-": { precedence: 1, associative: "left" },
      "*": { precedence: 2, associative: "left" },
      "/": { precedence: 2, associative: "left" },
      "^": { precedence: 3, associative: "right" },
      "~": { precedence: 3, associative: "right" },
    };
  }

  parse(tokens: IToken[]) {
    const stack: IToken[] = [];
    const rpn: IToken[] = [];

    let prev: IToken | null = null;
    let expect: TExpect = "operand";
    const argsCount: number[] = [];

    for (const token of tokens) {
      if (
        token.type === "number" ||
        token.type === "variable" ||
        token.type === "constant"
      ) {
        expect = this.parseOperand(token, rpn, expect);
      } else if (token.type === "function") {
        expect = this.parseFunction(token, stack, argsCount, expect);
      } else if (token.type === "delimeter") {
        expect = this.parseDelimeter(token, stack, rpn, argsCount, expect);
      } else if (
        token.type === "operator" &&
        token.value === "-" &&
        this.isUnary(token)
      ) {
        expect = this.parseUnary(token, stack, expect);
      } else if (token.type === "operator") {
        expect = this.parseOperator(token, stack, rpn, expect);
      } else if (token.type === "left_parenthesis") {
        expect = this.parseLeftParenthesis(token, stack, expect);
      } else if (token.type === "right_parenthesis") {
        expect = this.parseRightParenthesis(
          token,
          stack,
          rpn,
          argsCount,
          expect,
        );
      }
      prev = token;
    }

    this.parseLastOperators(stack, rpn, expect);

    return rpn;
  }

  isMorePrecedence(top: IToken, operator: IOperator): boolean {
    if (top.type === "left_parenthesis") {
      return false;
    }

    const lastOperatorInStack = this.operators[top.value];
    if (!lastOperatorInStack) {
      return false;
    }

    if (operator.associative === "right") {
      debugger;
      return lastOperatorInStack.precedence > operator.precedence;
    }
    return lastOperatorInStack.precedence >= operator.precedence;
  }

  isUnary(prev: IToken) {
    return (
      prev === null ||
      prev.type === "operator" ||
      prev.type === "left_parenthesis" ||
      prev.type === "delimeter"
    );
  }

  parseOperand(token: IToken, rpn: IToken[], expect: TExpect): TExpect {
    if (expect !== "operand") {
      throw new Error(
        `expected ${expect}, but got "${token.value}" (${token.start}:${token.end})`,
      );
    }
    rpn.push(token);
    return "operator";
  }

  parseFunction(
    token: IToken,
    stack: IToken[],
    argsCount: number[],
    expect: TExpect,
  ): TExpect {
    if (expect !== "operand") {
      throw new Error(
        `expected ${expect}, but got "${token.value}" (${token.start}:${token.end})`,
      );
    }
    stack.push(token);
    argsCount.push[1];
    return "(";
  }

  parseDelimeter(
    token: IToken,
    stack: IToken[],
    rpn: IToken[],
    argsCount: number[],
    expect: TExpect,
  ): TExpect {
    if (expect !== "operator") {
      throw new Error(
        `expected ${expect}, but got "${token.value}" (${token.start}:${token.end})`,
      );
    }
    while (
      stack.length &&
      stack[stack.length - 1].type !== "left_parenthesis"
    ) {
      rpn.push(stack.pop() as IToken);
    }
    if (stack.length === 0) {
      throw new Error(
        `"${token.value}" outside a function or without "(" (${token.start}:${token.end})`,
      );
    }
    if (argsCount.length === 0) {
      throw new Error(
        `"${token.value}" outside a function (${token.start}:${token.end})`,
      );
    }
    argsCount[argsCount.length - 1]++;
    return "operand";
  }

  parseUnary(token: IToken, stack: IToken[], expect: TExpect): TExpect {
    if (expect !== "operand") {
      throw new Error(
        `expected  ${expect}, but got "${token.value}" (${token.start}:${token.end})`,
      );
    }
    token.value = "~";

    stack.push(token);
    return "operand";
  }

  parseOperator(
    token: IToken,
    stack: IToken[],
    rpn: IToken[],
    expect: TExpect,
  ): TExpect {
    if (expect !== "operator") {
      throw new Error(
        `expected ${expect}, but got "${token.value}" (${token.start}:${token.end})`,
      );
    }

    // если стек операторов не пуст то с самого последнего добавленного оператора проверяем приоритетность
    // если текущий оператор-токен менее приоритетный чем добавленный ранее то достаем предыдущий оператор(и исключаем его из стека) и кладем этот оператор в rpn
    while (
      stack.length &&
      this.isMorePrecedence(
        stack[stack.length - 1],
        this.operators[token.value],
      )
    ) {
      rpn.push(stack.pop() as IToken);
    }
    // добавляем текущий токен в стек
    stack.push(token);
    return "operand";
  }

  parseLeftParenthesis(
    token: IToken,
    stack: IToken[],
    expect: TExpect,
  ): TExpect {
    if (expect === "operator") {
      throw new Error(
        `expected ${expect}, but got "${token.value}" (${token.start}:${token.end})`,
      );
    }
    stack.push(token);
    return "operand";
  }

  parseRightParenthesis(
    token: IToken,
    stack: IToken[],
    rpn: IToken[],
    argsCount: number[],
    expect: TExpect,
  ): TExpect {
    if (expect !== "operator") {
      throw new Error(
        `expect ${expect}, but got ")" (${token.start}:${token.end})`,
      );
    }
    while (
      stack.length &&
      stack[stack.length - 1].type !== "left_parenthesis"
    ) {
      rpn.push(stack.pop() as IToken);
    }
    if (stack.length === 0) {
      throw new Error(
        `"(" missing before "${token.value}" (${token.start}:${token.end})`,
      );
    }
    const funcInStack = stack.pop();
    if (stack.length && stack[stack.length - 1].type === "function") {
      const func = this.functions[stack[stack.length - 1].value];
      if (!func) {
        throw new Error(
          `No such function {${stack[stack.length - 1].value}} in function list`,
        );
      }
      const args = argsCount.pop();
      if (func.args !== args) {
        throw new Error(
          `invalid ${funcInStack.value} arguments count:  expected ${func.args}, got ${args} "${token.value} ${token.start}:${token.end}"`,
        );
      }

      rpn.push(stack.pop() as IToken);
    }

    return "operand";
  }

  parseLastOperators(stack: IToken[], rpn: IToken[], expect: TExpect) {
    while (stack.length !== 0) {
      const lastTokenInStack = stack.pop() as IToken;
      if (expect !== "operator") {
        throw new Error(
          `expect ${expect}, but got "${lastTokenInStack.value}" (${lastTokenInStack.start}:${lastTokenInStack.end})`,
        );
      }
      if (lastTokenInStack.type === "left_parenthesis") {
        throw new Error(
          `the brackets are disbalanced (${lastTokenInStack.start}:${lastTokenInStack.end})`,
        );
      }
      rpn.push(lastTokenInStack);
    }
  }
}

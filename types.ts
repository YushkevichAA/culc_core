export interface IToken {
  type: TokenType;
  value: string;
  start: number;
  end: number;
}

export type TokenType =
  | "left_parenthesis"
  | "right_parenthesis"
  | "delimeter"
  | "operator"
  | "function"
  | "constant"
  | "number"
  | "variable"
  | "unknown";

export interface IFunction {
  [key: string]: {
    args: number;
    evaluate: (...args: number[]) => number;
  };
}

export interface IConstants {
  [key: string]: number;
}

export interface IOperator {
  precedence: number;
  associative: "left" | "right";
}

export interface IPriorityOperatorsList {
  [key: string]: IOperator;
}

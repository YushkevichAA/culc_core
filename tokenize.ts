import { IToken, TokenType } from "./types";

export class ExpressionTokenizer {
  functions: string[];
  constants: string[];
  regexp;

  constructor({
    functions,
    constants,
  }: {
    functions: string[];
    constants: string[];
  }) {
    this.functions = functions;
    this.constants = constants;
    this.regexp = new RegExp(
      [
        `(?<left_parenthesis>\\()`, // открывающая скобка
        `(?<right_parenthesis>\\))`, // закрывающая скобка
        `(?<delimeter>,)`, // разделитель аргументов функции
        `(?<operator>[-+*/^~])`, //операторы
        `(?<function>${functions.join("|")})`, //функции
        `(?<constant>\\b(${constants.join("|")})\\b)`, //константы
        `(?<number>\\d+(\\.\\d+)?)`, // целые и вещественные числа
        `(?<variable>[a-z]\\w*)`,
        `(?<unknown>\\S)`, //все остальные символы, кроме пробельных
      ].join("|"),
      "gi",
    );
  }

  tokenize(expression: string): IToken[] {
    const matches: RegExpStringIterator<RegExpExecArray> = expression.matchAll(
      this.regexp,
    );

    const tokens = [...matches].map((match) => this.matchToToken(match));
    const filteredTokens = tokens.filter((token) => token !== null);

    const unknown = filteredTokens.filter((token) => token.type === "unknown");
    if (unknown.length > 0) {
      throw new Error(
        `invalid tokens found: ${unknown.map((token) => token.value).join(", ")}`,
      );
    }
    return filteredTokens;
  }

  matchToToken(match: RegExpExecArray) {
    if (!match["groups"]) return null;

    for (const [type, value] of Object.entries(match["groups"])) {
      if (value) {
        return {
          type: type as TokenType,
          value,
          start: match.index,
          end: match.index + value.length,
        };
      }
    }
    return null;
  }
}

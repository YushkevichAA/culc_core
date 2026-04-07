import { ExpressionParser } from "./ExpressionParser";
import { IVariables } from "./types";

export function TestParser(
  expression: string,
  expected: number,
  variables: IVariables = {},
  eps = 1e-15,
) {
  try {
    const parser = new ExpressionParser(expression);
    for (let [key, value] of Object.entries(variables)) {
      parser.setVariables(key, value);
    }

    const result = parser.evaluate();

    if (Math.abs(result - expected) < eps) {
      console.log(`%c${expression} = ${result}`, "color: green");
    } else {
      console.log(
        `%c${expression} = ${result}, but expected ${expected}`,
        "color: red",
      );
    }
  } catch (err) {
    if (err instanceof Error) {
      console.log(`%c"${expression}" is invalid`);
    }
  }
}

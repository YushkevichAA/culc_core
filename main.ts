import { TestParser } from "./TestParser";

// TestParser("1", 1); // 1 = 1
// TestParser("1 + 2 * 3", 7); // 1 + 2 * 3 = 7
TestParser("-(1 + 2) * 3 - 4", -13); // -(1 + 2) * 3 - 4 = -13
// TestParser("-2^2", -4); // -2^2 = -4
// TestParser("(-2)^2", 4); // (-2)^2 = 4
// TestParser("-2^-2", -0.25); // -2^-2 = -0.25
// TestParser("(-2)^-2", 0.25); // (-2)^-2 = 0.25
// TestParser("max(5 + 2^3, -7 * -9)", 63); // max(5 + 2^3, -7 * -9) = 63
// TestParser("cos(7 - 5)^2 + sin(4^0.5)^2", 1); // cos(7 - 5)^2 + sin(4^0.5)^2 = 1
// TestParser("sin(x) * (pi/-x - 5)^2", -9, { x: -Math.PI / 2 }); // sin(x) * (pi/-x - 5)^2 = -9

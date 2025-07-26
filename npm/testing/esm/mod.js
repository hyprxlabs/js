/**
 * ## Overview
 *
 * An adapter for the builtin Deno, Bun, and NodeJs testing frameworks which is
 * useful for library authors that are targeting multiple runtimes.
 *
 * The aim is provide a standard subset to run tests against all 3 runtimes
 * rather than implement all features and test styles until node:test is available
 * in all three testing runtimes.
 *
 * [logo](https://raw.githubusercontent.com/hyprxland/js/refs/heads/main/eassets/logo.png)
 *
 * [![JSR](https://jsr.io/badges/@hyprx/testing)](https://jsr.io/@hyprx/testing)
 * [![npm version](https://badge.fury.io/js/@hyprx%2Ftesting.svg)](https://badge.fury.io/js/@hyprx%2Ftesting)
 * [![GitHub version](https://badge.fury.io/gh/hyprxland%2Fjs-testing.svg)](https://badge.fury.io/gh/hyprxland%2Fjs-testing)
 *
 * ## Documentation
 *
 * Documentation is available on [jsr.io](https://jsr.io/@hyprx/testing/doc)
 *
 * ## Usage
 *
 * psuedo code to show off the test function.
 *
 * ```typescript
 * import { test } from "@hyprx/testing";
 *
 * test("simple", () => {
 *     console.log("test");
 * });
 *
 * test("use done", (_, done) => {
 *
 *     done(); // finishes the test.
 *
 *     done(new Error()) // finishes the test and throws an error.
 * });
 *
 * test("async", async () => {
 *     await Deno.writeTextFile("test.txt", test);
 *
 *     await exists("test.txt");
 * });
 *
 * test("skip", { skip: true}, () => {
 *     console.log("skipped test");
 * });
 *
 * test("timeout", { timeout: 2000 }, () => {
 *     // the test timeout will be exceeded
 *     setTimeout(() => { }, 3000);
 * });
 *
 * ```
 *
 * ## Functions
 *
 * - `test` - defines a test
 *
 * ## Notes
 *
 * This library was written to provide a common interface for testing across
 * different runtimes.  It is not a full featured testing library.
 *
 * Vitest and other libraries are cool, but they often don't run in deno.
 * @module
 * @license MIT
 */
import { globals } from "./globals.js";
export * from "./types.js";
let testFn;
if (globals.TestFn) {
    testFn = globals.TestFn;
}
else if (globals.Bun) {
    testFn = (await import("./bun.js")).test;
}
else if (globals.Deno) {
    testFn = (await import("./deno.js")).test;
}
else if (globals.process) {
    testFn = (await import("./node.js")).test;
}
else {
    throw new Error("No test runner found");
}
/**
 * The test function defines tests.
 */
export const test = testFn;

/**
 * ## Overview
 *
 * Split, join, splat commandline arguments/flags for the current runtime.
 *
 * ![logo](https://raw.githubusercontent.com/hyprxlabs/js/refs/heads/main/.eng/assets/logo.png)
 *
 * [![JSR](https://jsr.io/badges/@hyprx/flags)](https://jsr.io/@hyprx/flags)
 * [![npm version](https://badge.fury.io/js/@hyprx%2Fflags.svg)](https://badge.fury.io/js/@hyprx%2Fflags)
 * [![GitHub version](https://badge.fury.io/gh/hyprxlabs%2Fjs.svg)](https://badge.fury.io/gh/hyprxlabs%2Fjs)
 *
 * ## Documentation
 *
 * Documentation is available on [jsr.io](https://jsr.io/@hyprx/flags/doc)
 *
 * A list of other modules can be found at [github.com/hyprxlabs/js](https://github.com/hyprxlabs/js)
 *
 * ## Usage
 *
 * ```typescript
 * import {split, join, splat} from "@hyprx/flags";
 *
 * console.log(split("echo hello world")); // ["echo", "hello", "world"]
 *
 * console.log(join(["echo", "hello", "world"])); // "echo hello world"
 *
 * console.log(join(["echo", "hello world"])); // "echo \"hello world\""
 *
 * const args = splat({
 *     "foo": "bar",
 *     splat: {
 *         command: ["git", "clone"],
 *     } as SplatOptions,
 * });
 *
 * console.log(args); // ["git", "clone", "--foo", "bar"]
 * ```
 *
 * ## TODO
 *
 * - [ ] Add support for argument parsing
 *
 * ## Functions
 *
 * - `split` - splits a string into an array of arguments/flags.
 * - `join` - joins an array of arguments/flags into a string.
 * - `splat` - converts an object with flags into an array of arguments/flags.
 *
 * ## License
 *
 * [MIT License](./LICENSE.md)
 *
 * @module
 */
export * from "./splat.js";
export * from "./join.js";
export * from "./split.js";

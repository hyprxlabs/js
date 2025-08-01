/**
 * The `splat` module provides a function to convert an object
 * to an array of command line arguments.
 *
 * @module
 */
/**
 * Options for the {@linkcode splat} function.
 */
export interface SplatOptions extends Record<string, unknown> {
  /**
   * The subcommand command to execute.
   */
  command?: string[] | string;
  /**
   * The prefix to use for commandline options. Defaults to `"--"`.
   */
  prefix?: string;
  /**
   * Treats the flags as options that emit values.
   */
  noFlags?: string[] | boolean;
  /**
   * The values for true and false for flags.
   */
  noFlagValues?: {
    t?: string;
    f?: string;
  };
  /**
   * A lookup of aliases to remap the keys of the object
   * to the actual commandline option.  e.g. `{ "yes": "-y" }`
   * will map `{ yes: true }` to `["-y"]`.
   */
  aliases?: Record<string, string>;
  /**
   * The assigment token to use with options that have a value. The default
   * is to use a space. The common overrides are `":"` and `"="`.
   * This will turn `{ foo: "bar" }` into `["--foo", "bar"]` by default. If
   * assigned to `"="` it will become `["--foo=bar"]`.
   */
  assign?: string;
  /**
   * Whether to preserve the case of the keys. Defaults to `false`.
   */
  preserveCase?: boolean;
  /**
   * Whether to use short flags. Defaults to `true`.
   */
  shortFlag?: boolean;
  /**
   * Only include the keys that are in the `includes` array. Includes
   * take precedence over excludes.
   */
  includes?: Array<string | RegExp>;
  /**
   * Exclude the keys that are in the `excludes` array.
   */
  excludes?: Array<string | RegExp>;
  /**
   * Whether to ignore flags with `true` values. Defaults to `false`.
   */
  ignoreTrue?: boolean;
  /**
   * Whether to ignore flags with `false` values. Defaults to `false`.
   */
  ignoreFalse?: boolean;
  /**
   * The names of positional arguments. This will gather any keys as arguments
   * in the order of the given array.
   *
   * @example
   * ```ts
   * const args = splat({ foo: "bar", baz: "qux" }, { arguments: ["foo", "baz"] });
   * console.log(args); // ["bar", "qux"]
   * ```
   */
  argumentNames?: string[];
  /**
   * Whether to append the arguments to the end of the command. Defaults to `false`.
   *
   * @example
   * ```ts
   * const args = splat({ first: 1, foo: "bar", baz: "qux" }, { arguments: ["foo", "baz"], appendArguments: true });
   * console.log(args); // ["--first", "1", "bar", "qux"]
   * ```
   */
  appendArguments?: boolean;
}
/**
 * An object that contains the options for the {@linkcode splat} function.
 *
 * @example
 * ```ts
 * const args = splat({ f: "bar", splat: { shortFlag: true } });
 * console.log(args); // ["-f", "bar"]
 * ```
 */
export interface SplatObject extends Record<string | symbol | number, unknown> {
  splat?: SplatOptions;
}
/**
 * Special keys in a splat object that use
 * symbols to avoid conflicts with other keys
 * and to provide a way to access the values.
 *
 * @example
 * ```ts
 *
 * const args = {
 *   [SplatSymbols.command]: "run",
 *   [SplatSymbols.arguments]: ["task"],
 *   yes: true,
 * }
 *
 * splat(args); // ["run", "task", "--yes"]
 */
export declare const SplatSymbols: Record<string, symbol>;
/**
 * Converts an object to an `string[]` of command line arguments.
 *
 * @description
 * This is a modified version of the dargs npm package.  Its useful for converting an object to an array of command line arguments
 * especially when using typescript interfaces to provide intellisense and type checking for command line arguments
 * for an executable or commands in an executable.
 *
 * The code https://github.com/sindresorhus/dargs which is under under MIT License.
 * The original code is Copyrighted under (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
 * @param object The object to convert.
 * @param options The {@linkcode SplatOptions} to use for the conversion.
 * @returns An array of command line arguments.
 * @example
 * ```ts
 * let args = splat({ foo: "bar" });
 * console.log(args); // ["--foo", "bar"]
 *
 * args = splat({
 *     '*': ['foo', 'bar'], // positional arguments
 *     foo: "bar", // option
 *     yes: true, // flag
 *     '_': ["baz"], // remaining arguments
 *     '--': ["--baz"], // extra arguments
 * })
 *
 * console.log(args); // ["foo", "bar", "--foo", "bar", "--yes", "baz", "--", "--baz"]
 *
 * args = splat({
 *     [SplatSymbols.command]: "run",
 *     [SplatSymbols.arguments]: ["task1", "task2"],
 *     yes: true
 * });
 *
 * console.log(args); // ["run", "task", "task2" "--yes"]
 *
 * args = splat({
 *     "foo": "bar",
 *      "test": "baz",
 *      splat: {
 *          argumentNames: ["foo"],
 *          assign: "=",
 *      }
 * })
 *
 * console.log(args); // ["bar", "--foo=baz"]
 *
 * ```
 */
export declare function splat(object: SplatObject, options?: SplatOptions): string[];

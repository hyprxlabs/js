/**
 * ## Overview
 *
 * The exec module makes it easy to spawn child_processes across
 * different runtimes (NodeJS, Bun, Deno) and different operating
 * systems (Windows, Linux, Mac) and include additional utilities
 * like splatting arguments and looking up executables on the path.
 *
 * ![logo](https://raw.githubusercontent.com/hyprxlabs/js/refs/heads/main/.eng/assets/logo.png)
 *
 * [![JSR](https://jsr.io/badges/@hyprx/exec)](https://jsr.io/@hyprx/exec)
 * [![npm version](https://badge.fury.io/js/@hyprx%2Fexec.svg)](https://badge.fury.io/js/@hyprx%2Fexec)
 * [![GitHub version](https://badge.fury.io/gh/hyprxlabs%2Fjs.svg)](https://badge.fury.io/gh/hyprxlabs%2Fjs)
 *
 * ## Documentation
 *
 * Documentation is available on [jsr.io](https://jsr.io/@hyprx/exec/doc)
 *
 * A list of other modules can be found at [github.com/hyprxlabs/js](https://github.com/hyprxlabs/js)
 *
 * ## Usage
 *
 * ```typescript
 * import { Command, cmd, run, exec, which } from "@hyprx/exec";
 *
 * console.log( await (which("git"))); //path to git
 *
 * // string, array, or objects can be used for "args".
 * const cmd1 = new Command(["git", "show-ref", "master"], {
 *     env: { "MY_VAR": "TEST" },
 *     cwd: "../parent"
 * });
 * const output = await cmd1.output();
 *
 * console.log(output); // ->
 * // {
 * //    code: 0,
 * //    signal: undefined,
 * //    success: true
 * //    stdout: Uint8Array([01, 12..])
 * //    stderr: Uint8Array([0])
 * // }
 *
 * // the output result has different methods on it..
 * console.log(output.text()) // text
 * console.log(output.lines()) // string[]
 * console.log(output.json()) // will throw if output is not valid json
 *
 * const cmd2 = cmd(["git", "show-ref", "master"]);
 *
 * // these are the same.
 * console.log(await cmd2.output())
 * console.log(await cmd2);
 * console.log(await new Command(["git", "show-ref", "master"]));
 *
 * console.log(await cmd2.text()); // get only the text from stdout instead
 *
 * // pipe commands together
 * const result = await cmd(["echo", "my test"])
 *     .pipe(["grep", "test"])
 *     .pipe("cat")
 *     .output();
 *
 * console.log(result.code);
 * console.log(result.stdout);
 *
 * // output is the short hand for new Command().output()
 * // and output defaults stdout and stderr to 'piped'
 * // which returns the stdout and stderr streams a as Uint8Array
 * const text = await exec(["git", "show-ref", "master"]).then(o => o.text());
 *
 * console.log(text);
 *
 * // exec will let you use a string for the command which will use
 * // splitArguments on the string and pass those to the cmd function.
 * console.log(await cmd("git show-ref master").text());
 *
 * ```
 *
 * ## Classes
 *
 * - Command - A command/syscall that spawns a child process.
 * - Options - An interface that respresents the output of a command.
 * - PathFinder - A registry of executable paths, which can include additional
 *   paths to find the executable in case its not yet available in the PATH.
 * - ShellCommand - A command/syscall that spawns a child process for shells
 *   like pwsh, powershell, bash, sh, etc.
 *
 * ## Functions
 *
 * - `cmd` - Creates a new command.
 * - `exec` - Creates a new command and executes it with the standard streams set to 'piped'.
 * - `execSync` - Creates a new command and executes it with the standard streams set to 'piped' synchronously.
 * - `run` &amp; `runSync` - Creates a new command sets the standard streams to `inherit`
 *    executes the command.
 * - `runSync` - Creates a new command sets the standard streams to `inherit`
 *    executes the command synchronously.
 * - `setLogger` - Sets a global logger that logs comamnds and its parameters any time
 *    a command is executed.
 * - `spawn` - Spawns a child process and lets you interact with the child process.
 * - `which` &amp; `whichSync` - Determines if a command/app is available on the environment path
 *   and returns the full path if found.
 *
 * ## License
 *
 * [MIT License](./LICENSE.md)
 *
 * @module
 */
export * from "./command.js";
export * from "./which.js";
export { setLogger } from "./set_logger.js";
export * from "./path_finder.js";
export * from "./errors.js";

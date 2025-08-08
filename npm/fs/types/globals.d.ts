import { globals, WINDOWS } from "@hyprx/globals";
export { globals, WINDOWS };
/**
 * @internal
 */
export declare const WIN: boolean;
export declare function loadFs(): typeof import("node:fs") | undefined;
export declare function loadFsAsync(): typeof import("node:fs/promises") | undefined;

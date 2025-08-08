import { test } from "@hyprx/testing";
import { equal } from "@hyprx/assert";
import { join } from "./join.js";
import process from "node:process";
test("flags::join simple args", () => {
  equal(join(["echo", "hello", "world"]), "echo hello world");
});
test("flags::join args with spaces", () => {
  equal(join(["echo", "hello world"]), 'echo "hello world"');
});
test("flags::join args with quotes, unix", () => {
  if (process.platform === "win32") {
    equal(join(["echo", 'he"llo']), 'echo he\\"llo');
  } else {
    equal(join(["echo", 'he"llo']), 'echo "he\\"llo"');
  }
  equal(join(["echo", 'he"llo']), 'echo "he\\"llo"');
});
test("flags::join args with single quote, unix", () => {
  equal(join(["echo", "he'llo"]), 'echo "he\'llo"');
});
test("flags::join args with backslash, unix", () => {
  equal(join(["echo", "he\\llo"]), 'echo "he\\\\llo"');
});
test("flags::join args with dollar, backtick, unix", () => {
  if (process.platform === "win32") {
    equal(join(["echo", "he$llo", "he`llo"]), "echo he$llo he`llo");
  } else {
    equal(join(["echo", "he$llo", "he`llo"]), 'echo "he\\$llo" "he\\`llo"');
  }
});
test("flags::join simple args, windows", () => {
  equal(join(["echo", "hello", "world"]), "echo hello world");
});
test("flags::join args with spaces, windows", () => {
  equal(join(["echo", "hello world"]), 'echo "hello world"');
});
test("flags::join args with double quote, windows", () => {
  equal(join(["echo", 'he"llo']), 'echo "he\\"llo"');
});
test("flags::join args with backslash, windows", () => {
  equal(join(["echo", "he\\llo"]), 'echo "he\\\\llo"');
});
test("flags::join args with double quote and backslash, windows", () => {
  equal(join(["echo", 'he\\"llo']), 'echo "he\\\\\\"llo"');
});
test("flags::join empty args", () => {
  equal(join([]), "");
});

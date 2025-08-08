import { test } from "@hyprx/testing";
import { equal } from "@hyprx/assert";
import { join, unixJoin, windowsJoin } from "./join.js";
test("flags::windowsJoin joins simple args without special chars", () => {
  equal(windowsJoin(["foo", "bar", "baz"]), "foo bar baz");
});
test("flags::windowsJoin joins args with spaces", () => {
  equal(windowsJoin(["foo", "bar baz"]), 'foo "bar baz"');
});
test("flags::windowsJoin joins args with double quotes", () => {
  equal(windowsJoin(["foo", 'bar"baz']), 'foo "bar\\"baz"');
});
test("flags::windowsJoin joins args with backslashes", () => {
  equal(windowsJoin(["foo", "bar\\baz"]), "foo bar\\baz");
});
test("flags::windowsJoin joins args with multiple backslashes before quote", () => {
  equal(windowsJoin(["foo", 'bar\\\\\\"baz']), 'foo "bar\\\\\\\\\\\\\\"baz"');
});
test("flags::unixJoin joins simple args without special chars", () => {
  equal(unixJoin(["foo", "bar", "baz"]), "foo bar baz");
});
test("flags::unixJoin joins args with spaces", () => {
  equal(unixJoin(["foo", "bar baz"]), 'foo "bar baz"');
});
test("flags::unixJoin joins args with double quotes", () => {
  equal(unixJoin(["foo", 'bar"baz']), 'foo "bar\\"baz"');
});
test("flags::unixJoin joins args with dollar sign and backtick", () => {
  equal(unixJoin(["foo", "bar$`baz"]), 'foo "bar\\$\\`baz"');
});
test("flags::unixJoin joins args with backslashes", () => {
  equal(unixJoin(["foo", "bar\\baz"]), 'foo "bar\\\\baz"');
});
test("flags::join joins simple args without special chars", () => {
  equal(join(["foo", "bar", "baz"]), "foo bar baz");
});
test("flags::join joins args with spaces", () => {
  equal(join(["foo", "bar baz"]), 'foo "bar baz"');
});

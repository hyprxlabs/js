import { test } from "@hyprx/testing";
import { ok } from "@hyprx/assert";
import { pid } from "./pid.js";
import { globals } from "@hyprx/globals";
test("process::pid", () => {
  if (globals.Deno || globals.process) {
    ok(pid > 0);
  } else {
    ok(pid === 0);
  }
});

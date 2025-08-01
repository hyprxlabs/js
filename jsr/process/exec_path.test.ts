import { test } from "@hyprx/testing";
import { exists, ok } from "@hyprx/assert";
import { NODELIKE } from "@hyprx/globals";
import { execPath } from "./exec_path.ts";

test("process::execPath", () => {
    const p = execPath();
    exists(p);
    console.log(p);
    if (NODELIKE) {
        ok(p.length > 0);
    } else {
        ok(p.length === 0);
    }
});

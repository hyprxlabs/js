import { Runner } from "jsr:@dotrex/runtime@0.0.0-alpha.1";
import { projectRootDir } from "./tasks/paths.ts";
import path from "node:path";

if (import.meta.main) {
    const runner = new Runner();
    const args = Deno.args;
    console.log(args);

    await runner.run({
        args: args,
        cwd: projectRootDir,
        command: 'task',
        targets: [args[0]],
        file: path.join(projectRootDir, '.eng', 'tasks.ts'),
    });
}
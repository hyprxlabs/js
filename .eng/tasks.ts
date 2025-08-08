import { task } from "jsr:@dotrex/file@0.0.0-alpha.1";
import { syncProjects, listProjects, filter } from "./tasks/projects.ts";
import { runDnt } from "./tasks/dnt.ts";
import { jsrDir, npmDir, projectRootDir } from "./tasks/paths.ts";
import { parseArgs } from "jsr:@std/cli@1"
import { getConfig, Project } from "./tasks/config.ts";
import { dirname } from "jsr:@std/path@1";
import { basename, join } from "node:path";
import { expandGlob, expandGlobSync } from "jsr:@std/fs@1";
import { blue } from "jsr:@std/fmt@1/colors";
import { updateModDocumentation } from "./tasks/docs.ts";
import { updateVersions } from "./tasks/versions.ts";
task("default", () => {
    console.log("Hello from Hyprx!"); 
});

task({
    id: "projects:sync",
    description: "Sync projects to the config",
    async run() {
        await syncProjects();
    },
});

task({
    id: "projects:update",
    async run(ctx) {
        const parsed = parseArgs(ctx.args ?? [], {
            boolean: ["all"],
        });

        const projects = getConfig().projects;
        let projectNames: Array<string> | undefined = undefined;

        if (parsed.all || (ctx.args && (ctx.args.includes("--all")))) {
            projectNames = projects.map((p) => p.name);
        } else {
            projectNames = [];
            for (const arg of ctx.args!) {
                const project = projects.find((p) => p.name === arg);
                if (project) {
                    projectNames.push(project.name);
                }
            }
        }

        console.log("")
        console.log("### UPDATE MOD DOCS ###");
        await updateModDocumentation(projectNames);

        console.log("")
        console.log("### DENO NPM TRANSPILER ###");
        await runDnt(projectNames);

        let deno = true;
        let node = true;
        if (ctx.args && ctx.args.includes("--jsr") || ctx.args?.includes("--deno")) {
            node = false;
        }

        if (ctx.args && ctx.args.includes("--node")) {
            deno = false;
        }

        console.log("deno", deno, "node", node);

        if (deno) {
            console.log("")
            console.log(blue("### FMT JSR ###"));
            for (const project of projectNames) {
                const cmd = new Deno.Command("deno", {
                    args: ["fmt"],
                    stdout: "inherit",
                    stderr: "inherit",
                    cwd: join(jsrDir, project),
                });
                const o = await cmd.output();
                if (o.code !== 0) {
                    throw new Error("Failed to format the jsr code");
                }
            }

           
        }

        if (node) {
            console.log("")
            console.log(blue("### FMT NPM ###"));

            for( const project of projectNames) {
                const cmd = new Deno.Command("deno", {
                    args: ["fmt", ".", "--line-width", "100", "indent-width", "4", "--ignore=node_modules,**/*.md"],
                    stdout: "inherit",
                    stderr: "inherit",
                    cwd: join(npmDir, project),
                })

                const o = await cmd.output();
                if (o.code !== 0) {
                    throw new Error("Failed to format the npm code");
                }
            }
        }
    }
})

task({
    id: "docs:mod",
    description: "Update the mod.ts documentation from the README.md",
    async run(ctx) {
        let targets: string | string[] = ctx.args ?? [];
        if (ctx.args && ctx.args.includes("--all") || ctx.args?.includes("-a")) {
            const projects = getConfig().projects.map((p) => p.name);
            targets = projects;
        }

        await updateModDocumentation(targets);
    }
})

task({
    id: "dnt",
    description: "Build the npm package",
    async run(ctx) {
        const parsed = parseArgs(ctx.args ?? [], {
            boolean: ["all"],
        });

        const projects = getConfig().projects;
        let projectNames : Array<string>  | undefined = undefined;

        if (parsed.all || (ctx.args && (ctx.args.includes("--all")))) {
            projectNames = projects.map((p) => p.name);
        } else {
            projectNames = [];
            for (const arg of ctx.args!) {
                const project = projects.find((p) => p.name === arg);
                if (project) {
                    projectNames.push(project.name);
                }
            }
        }

        console.log(projects);
        console.log(projectNames);

        await runDnt(projectNames);
    }
})

task({
    id: "projects:list",
    description: "List all projects",
    run() {
        listProjects()
    },
});

task({
    id: "version:update",
    description: "Update project versions",
    async run(ctx) {
        let targets: string | string[] = ctx.args ?? [];
        if (ctx.args && ctx.args.includes("--all") || ctx.args?.includes("-a")) {
            const projects = getConfig().projects.map((p) => p.name);
            targets = projects;
        }

        await updateVersions(targets);
    }
})

task({
    id: "fmt",
    description: "Format the jsr code",
    async run(ctx) {
        let deno = true;
        let node = true;
        if (ctx.args && ctx.args.includes("--jsr") || ctx.args?.includes("--deno")) {
            node = false;
        }

        if (ctx.args && ctx.args.includes("--node")) {
            deno = false;
        }

        console.log("deno", deno, "node", node);

        if (deno) {
            console.log("")
            console.log(blue("### FMT JSR ###"));
            const cmd = new Deno.Command("deno", {
                args: ["fmt"],
                stdout: "inherit",
                stderr: "inherit",
                cwd: jsrDir,
            });
            const o = await cmd.output();
            if (o.code !== 0) {
                throw new Error("Failed to format the jsr code");
            }
        }

        if (node) {
            console.log("")
            console.log(blue("### FMT NPM ###"));

            const cmd = new Deno.Command("deno", {
                args: ["fmt", ".", "--line-width", "100", "indent-width", "4", "--ignore=node_modules,**/*.md"],
                stdout: "inherit",
                stderr: "inherit",
                cwd: npmDir,
            })

            const o = await cmd.output();
            if (o.code !== 0) {
                throw new Error("Failed to format the npm code");
            }
        }
    }
});

task({
    "id": "lint",
    "description": "Lint the jsr code",
    async run(ctx) {
        let deno = true;
        let node = true;
        if (ctx.args && ctx.args.includes("--jsr") || ctx.args?.includes("--deno")) {
            node = false;
        }

        if (ctx.args && ctx.args.includes("--node")) {
            deno = false;
        }

        console.log("deno", deno, "node", node);
        
        if (deno) {
            const cmd = new Deno.Command("deno", {
                args: ["lint"],
                stdout: "inherit",
                stderr: "inherit",
                cwd: jsrDir,
            });
            const o = await cmd.output();
            if (o.code !== 0) {
                throw new Error("Failed to lint the jsr code");
            }
        }
    }
});

task({
    id: "jsr:publish",
    description: "Dry run for publishing the jsr package to deno.land",
    async run() {

        const isWindows = Deno.build.os === "windows";
        const deno = isWindows ? "deno.exe" : "deno";

        const cmd = new Deno.Command(deno, {
            args: ["publish"],
            stdout: "inherit",
            stderr: "inherit",
            cwd: jsrDir
        });
        const o = await cmd.output();
        if (o.code !== 0) {
            throw new Error(`Failed to publish to jsr.io`);
        }
    }
})

task({
    id: "jsr:publish:dry",
    description: "Dry run for publishing the jsr package to deno.land",
    async run() {

        const isWindows = Deno.build.os === "windows";
        const deno = isWindows ? "deno.exe" : "deno";

        const cmd = new Deno.Command(deno, {
            args: ["publish", "--dry-run", "--allow-dirty"],
            stdout: "inherit",
            stderr: "inherit",
            cwd: jsrDir
        });
        const o = await cmd.output();
        if (o.code !== 0) {
            throw new Error(`Failed to publish to jsr.io`);
        }
    }
})

task({
    id: "npm:publish:dry",
    description: "Dry run for publishing the npm package",
    async run() {
        const isWindows = Deno.build.os === "windows";
        const npm = isWindows ? "npm.cmd" : "npm";

        const cmd = new Deno.Command(npm, {
            args: ["publish", "--dry-run"],
            stdout: "inherit",
            stderr: "inherit",
            cwd: npmDir
        });
        const o = await cmd.output();
        if (o.code !== 0) {
            throw new Error(`Failed to publish to npm`);
        }
    }
});

task({
    id: "npm:publish",
    description: "Publish the npm package",
    async run() {
        const isWindows = Deno.build.os === "windows";
        const npm = isWindows ? "npm.cmd" : "npm";

        const cmd = new Deno.Command(npm, {
            args: ["publish", "--provenance", "--access", "public"],
            stdout: "inherit",
            stderr: "inherit",
            cwd: npmDir
        });
        const o = await cmd.output();
        if (o.code !== 0) {
            throw new Error(`Failed to publish to npm`);
        }
    }
});

task({
    id: "npm:audit",
    description: "Run npm audit",
    async run() {
        const isWindows = Deno.build.os === "windows";
        const npm = isWindows ? "npm.cmd" : "npm";

        const cmd = new Deno.Command(npm, {
            args: ["audit"],
            stdout: "inherit",
            stderr: "inherit",
            cwd: npmDir
        });
        const o = await cmd.output();
        if (o.code !== 0) {
            throw new Error(`Failed to run npm audit`);
        }
    }
})

task({
    id: "test",
    description: "Run the tests",
    async run(ctx) {
        let deno = true;
        let node = true;
        let bun = true;
        let args : string[] = ctx.args ?? [];
        const config = getConfig();
        const parsed = parseArgs(args, {
            boolean: ["deno", "jsr", "node", "all"],
            collect: ["project", "glob"],
            string: ["project", "glob"],
            alias: {
                p: "project",
                g: "glob",
            }
        })

        console.log("Parsed arguments:", parsed);

        args = parsed._ as string[];

        if (args.includes("--jsr") || args.includes("--deno")) {
            args = args.filter((a) => a !== "--jsr" && a !== "--deno");
            node = false;
            bun = false;
        }

        if (ctx.args && ctx.args.includes("--node")) {
            args = args.filter((a) => a !== "--node");
            deno = false;
            bun = false;
        }


        const globs = parsed.glob ?? [];
        const denoGlobs : string[] = [];
        const nodeGlobs : string[] = [];
        const projectsNames = parsed.project ?? [];

        for (const arg of parsed.project ?? []) {
            denoGlobs.push(`${arg}/**/*.test.ts`);
            nodeGlobs.push(`${arg}/**/*.test.js`);
        }

        for (const arg of globs) {
            denoGlobs.push(arg);
            nodeGlobs.push(arg);
        }


        let projects : Array<Project> = getConfig().projects ?? [];
        if (projectsNames.length > 0) {
            projects = await filter(config.projects, projectsNames, false);
        }

        if (projects.length === 0) {
            projects = config.projects;
        }



        if (deno) {
            console.log("### DENO TESTS ###");

            if (denoGlobs.length === 0) {
                for (const project of projects) {
                    if (project.denoConfig) {
                        const dir = dirname(project.denoConfig);
                        const base = basename(dir);
                        denoGlobs.push(`${base}/**/*.test.ts`);
                    }
                }
            }

            console.log("denoGlobs", denoGlobs);

            const cmd = new Deno.Command("deno", {
                args: ["test", "-A", ...denoGlobs],
                stdout: "inherit",
                stderr: "inherit",
                cwd: jsrDir,
            });
            const o = await cmd.output();
            if (o.code !== 0) {
                throw new Error("Failed to run the tests");
            }
        }

        if (node) {
            console.log("")
            console.log("### NODE TESTS ###");
            globs.length = 0;
            if (nodeGlobs.length === 0) {
                for (const project of projects) {
                    if (project.packageJson) {
                        const dir = join(projectRootDir, dirname(project.packageJson))
                        globs.push(`${dir}/**/*.test.js`);
                    }
                }
            }

            console.log("nodeGlobs", nodeGlobs);

            const cmd = new Deno.Command("node", {
                args: ["--test", ...nodeGlobs],
                stdout: "inherit",
                stderr: "inherit",
                cwd: npmDir,
            });
            const o = await cmd.output();
            if (o.code !== 0) {
                throw new Error("Failed to run the tests");
            }
            
        }

        if (bun) {
            console.log("")
            console.log("")
            console.log("### BUN TESTS ###");
            console.log("nodeGlobs", nodeGlobs);
            if (nodeGlobs.length === 0) {
                for (const project of projects) {
                    if (project.packageJson) {
                        const dir = join(projectRootDir, dirname(project.packageJson))
                        nodeGlobs.push(`${dir}/**/*.test.js`);
                    }
                }
            }

            let failed = false;
            const promises: Array<Promise<void>> = [];

            if (Deno.build.os === "windows") {
                for (const glob of nodeGlobs) {
                    for await (const fi of expandGlob(glob, { includeDirs: false, root: npmDir })) {

                        const cmd = new Deno.Command("bun", {
                            args: ["test", fi.path],
                            stdout: "inherit",
                            stderr: "inherit",
                            cwd: npmDir,
                        });

                        // bun crashes on windows if too many commands are run at once
                        const o = await cmd.output();
                        if (o.code !== 0) {
                            console.error("Bun test failed for", fi.path);
                            failed = true;
                        }
                    }
                }
            } else {

                for (const glob of nodeGlobs) {
                    for await (const fi of expandGlob(glob, { includeDirs: false, root: npmDir })) {

                        const cmd = new Deno.Command("bun", {
                            args: ["test", fi.path],
                            stdout: "inherit",
                            stderr: "inherit",
                            cwd: npmDir,
                        });
                        promises.push(cmd.output().then((o) => {
                            if (o.code !== 0) {
                                console.error("Bun test failed for", fi.path);
                                failed = true;
                            }
                        }));
                    }

                    if (promises.length === 30) {
                        await Promise.all(promises);
                        promises.length = 0;
                    }
                }
            
                if (promises.length === 30) {
                    await Promise.all(promises);
                    promises.length = 0;
                }
            }

            if (failed) {
                console.error("Bun tests failed");
                Deno.exit(1);
            }
        }
    }
})


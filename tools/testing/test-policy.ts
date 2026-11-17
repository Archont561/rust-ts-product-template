import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { type ToolContext, tool } from "@archont561/tasknest";

interface SchemaMutationCase {
  ruleId: string;
  targetFile: string;
  mutate: (validContent: string) => string;
}

const REAL_SCHEMA_CASES: SchemaMutationCase[] = [
  {
    ruleId: "pixi-only-tools-task",
    targetFile: "pixi.toml",
    mutate: (content) => content.replace("[tasks]\n", '[tasks]\nextra = "alint check"\n'),
  },
  {
    ruleId: "schema-root-package",
    targetFile: "package.json",
    mutate: (content) => {
      const parsed = JSON.parse(content) as Record<string, unknown>;
      return `${JSON.stringify({ ...parsed, scripts: { test: "bun test" } }, null, 2)}\n`;
    },
  },
  {
    ruleId: "schema-lefthook-config",
    targetFile: "lefthook.yml",
    mutate: (content) =>
      content.replace("run: pixi run tools run quality lint-repo", "run: bun test"),
  },
  {
    ruleId: "schema-rumdl-config",
    targetFile: ".rumdl.toml",
    mutate: (content) => content.replace("respect-gitignore = true", "respect-gitignore = false"),
  },
  {
    ruleId: "schema-pixi-sandbox-config",
    targetFile: "pixi-sandbox.toml",
    mutate: (content) => content.replace("cargo_vendor = true", "cargo_vendor = false"),
  },
  {
    ruleId: "schema-github-issue-forms",
    targetFile: ".github/ISSUE_TEMPLATE/bug_report.yml",
    mutate: (content) => content.replace("type: dropdown", "type: invalid_widget"),
  },
  {
    ruleId: "schema-codecov-config",
    targetFile: ".codecov.yml",
    mutate: (content) => content.replace("flags: [rust]", "flags: []"),
  },
  {
    ruleId: "schema-github-change-filters",
    targetFile: "tools/ci/filters.json",
    mutate: (content) => content.replace('"rust": [', '"rust": [],'),
  },
  {
    ruleId: "schema-app-package",
    targetFile: "apps/desktop/package.json",
    mutate: (content) => content.replace('"persistent": true', '"persistent": "yes"'),
  },
];

function verifyRealSchemas(repoRoot: string): void {
  const workDir = mkdtempSync(join(tmpdir(), "alint-real-schemas-"));
  try {
    cpSync(join(repoRoot, ".alint.yml"), join(workDir, ".alint.yml"));
    cpSync(join(repoRoot, ".alint", "schemas"), join(workDir, ".alint", "schemas"), {
      recursive: true,
    });

    for (const testCase of REAL_SCHEMA_CASES) {
      const validContent = readFileSync(join(repoRoot, testCase.targetFile), "utf8");
      const invalidContent = testCase.mutate(validContent);
      if (invalidContent === validContent) {
        throw new Error(
          `Mutation for '${testCase.ruleId}' on '${testCase.targetFile}' produced no change.`,
        );
      }

      const targetPath = join(workDir, testCase.targetFile);
      mkdirSync(dirname(targetPath), { recursive: true });

      writeFileSync(targetPath, validContent, "utf8");
      const validResult = spawnSync(
        "alint",
        ["check", "--config", join(workDir, ".alint.yml"), "--only", testCase.ruleId, workDir],
        { encoding: "utf8" },
      );
      if (validResult.status !== 0) {
        throw new Error(
          `Expected real '${testCase.targetFile}' to pass '${testCase.ruleId}', got exit ${validResult.status}:\n${validResult.stdout}${validResult.stderr}`,
        );
      }

      writeFileSync(targetPath, invalidContent, "utf8");
      const invalidResult = spawnSync(
        "alint",
        ["check", "--config", join(workDir, ".alint.yml"), "--only", testCase.ruleId, workDir],
        { encoding: "utf8" },
      );
      if (invalidResult.status === 0) {
        throw new Error(
          `Expected mutated '${testCase.targetFile}' to fail '${testCase.ruleId}', but it passed.`,
        );
      }

      rmSync(targetPath, { force: true });
      process.stdout.write(`PASS real-schema ${testCase.ruleId} (valid pass + mutated fail)\n`);
    }
  } finally {
    rmSync(workDir, { recursive: true, force: true });
  }
}

export const testPolicy = tool(
  {
    name: "test-policy",
    description:
      "Run declarative alint policy tests (.alint/tests) and real-schema regression checks (.alint/schemas).",
    marks: ["lint", "test", "fast"],
    requires: ["alint"],
    options: [
      {
        name: "tag",
        type: "string",
        default: "",
        description: "Optional alint test --tag filter (skips real-schema suite when set).",
      },
      {
        name: "filter",
        type: "string",
        default: "",
        description: "Optional alint test --filter substring (skips real-schema suite when set).",
      },
    ],
  },
  (ctx: ToolContext, args) => {
    const argv = ["alint", "test", ".alint/tests"];
    if (args.tag) {
      argv.push("--tag", String(args.tag));
    }
    if (args.filter) {
      argv.push("--filter", String(args.filter));
    }
    ctx.run(argv);

    if (!args.tag && !args.filter) {
      verifyRealSchemas(ctx.repoRoot);
    }
  },
);

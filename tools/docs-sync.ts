import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { type ToolContext, tool } from "@archont561/tasknest";
import { Template } from "@huggingface/jinja";

interface WorkspaceFacts {
  version: string;
  schema_count: number;
  policy_test_count: number;
  app_count: number;
  app_names: string[];
  issue_areas: string[];
  rust_crate_count: number;
  rust_adapter_count: number;
  ts_package_count: number;
  skill_count: number;
  skill_list: string;
}

function countFiles(dir: string, suffix: string): number {
  if (!existsSync(dir)) {
    return 0;
  }
  let total = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      total += countFiles(full, suffix);
    } else if (entry.isFile() && entry.name.endsWith(suffix)) {
      total += 1;
    }
  }
  return total;
}

function listChildDirsWithFile(parentDir: string, markerFile: string): string[] {
  if (!existsSync(parentDir)) {
    return [];
  }
  return readdirSync(parentDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(parentDir, entry.name, markerFile)))
    .map((entry) => entry.name)
    .sort();
}

function collectWorkspaceFacts(root: string): WorkspaceFacts {
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as {
    version: string;
  };
  const skills = listChildDirsWithFile(join(root, ".agents", "skills"), "SKILL.md");

  const rustCrates = listChildDirsWithFile(join(root, "rust", "crates"), "Cargo.toml");
  const rustAdapters = listChildDirsWithFile(join(root, "rust", "adapters"), "Cargo.toml");

  const tsPackages = [
    ...listChildDirsWithFile(join(root, "packages"), "package.json"),
    ...listChildDirsWithFile(join(root, "packages", "frontend"), "package.json"),
    ...listChildDirsWithFile(join(root, "packages", "infrastructure"), "package.json"),
  ];

  const appsDir = join(root, "apps");
  const appNames = existsSync(appsDir)
    ? readdirSync(appsDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort()
    : [];

  const issueAreas = [
    ...appNames.map((name) => `apps/${name}`),
    "rust/crates/* (domain, contracts, services, storage, sync)",
    "rust/adapters/* (axum, tauri, wasm)",
    "packages/* (TS core, frontend, injectable infra)",
    "Tooling / CI / Pixi / offline sandbox",
  ];

  return {
    version: pkg.version,
    schema_count: countFiles(join(root, ".alint", "schemas"), ".schema.json"),
    policy_test_count: countFiles(join(root, ".alint", "tests"), ".yml"),
    app_count: appNames.length,
    app_names: appNames,
    issue_areas: issueAreas,
    rust_crate_count: rustCrates.length,
    rust_adapter_count: rustAdapters.length,
    ts_package_count: tsPackages.length,
    skill_count: skills.length,
    skill_list: skills.map((name) => `\`${name}\``).join(", "),
  };
}

function renderTemplate(templatePath: string, vars: Record<string, unknown>): string {
  const source = readFileSync(templatePath, "utf8");
  const rendered = new Template(source).render(vars);
  return rendered.endsWith("\n") ? rendered : `${rendered}\n`;
}

const RENDERED_DOCS = [
  { template: "templates/README.md.j2", output: "README.md" },
  { template: "templates/AGENTS.md.j2", output: "AGENTS.md" },
  {
    template: "templates/github/ISSUE_TEMPLATE/bug_report.yml.j2",
    output: ".github/ISSUE_TEMPLATE/bug_report.yml",
  },
  {
    template: "templates/github/ISSUE_TEMPLATE/feature_request.yml.j2",
    output: ".github/ISSUE_TEMPLATE/feature_request.yml",
  },
  {
    template: "templates/github/ISSUE_TEMPLATE/config.yml.j2",
    output: ".github/ISSUE_TEMPLATE/config.yml",
  },
  {
    template: "templates/github/PULL_REQUEST_TEMPLATE.md.j2",
    output: ".github/PULL_REQUEST_TEMPLATE.md",
  },
] as const;

const SCAFFOLD_TEMPLATES: Record<string, string> = {
  crate: "templates/crate-readme.md.j2",
  package: "templates/package-readme.md.j2",
  app: "templates/app-readme.md.j2",
};

export const docsSync = tool(
  {
    name: "docs-sync",
    description:
      "Render or verify README.md, AGENTS.md, and .github/ issue & PR templates from templates/*.j2.",
    marks: ["docs", "fast", "offline"],
    requires: ["bun"],
    options: [
      {
        name: "write",
        type: "boolean",
        default: false,
        description: "Write rendered docs and GitHub templates instead of checking for drift.",
      },
      {
        name: "scaffold",
        type: "string",
        default: "",
        description: "Optional unit README template kind to scaffold: crate, package, or app.",
      },
      {
        name: "name",
        type: "string",
        default: "",
        description: "Unit name used with --scaffold (e.g. product-billing or @product/billing).",
      },
      {
        name: "output",
        type: "string",
        default: "",
        description: "Destination README path used with --scaffold.",
      },
    ],
  },
  (ctx: ToolContext, args) => {
    const root = ctx.repoRoot;
    const scaffoldKind = String(args.scaffold ?? "");

    if (scaffoldKind) {
      const templateRel = SCAFFOLD_TEMPLATES[scaffoldKind];
      if (!templateRel) {
        throw new Error(
          `Unknown --scaffold kind '${scaffoldKind}'. Expected one of: crate, package, app.`,
        );
      }
      const unitName = String(args.name ?? "");
      const outRel = String(args.output ?? "");
      if (!unitName || !outRel) {
        throw new Error("--scaffold requires both --name and --output.");
      }
      const rendered = renderTemplate(join(root, templateRel), {
        name: unitName,
        summary: "Describe the responsibilities and invariants of this unit.",
      });
      const outPath = resolve(root, outRel);
      mkdirSync(dirname(outPath), { recursive: true });
      writeFileSync(outPath, rendered, "utf8");
      process.stdout.write(`WROTE ${outRel}\n`);
      return;
    }

    const facts = collectWorkspaceFacts(root);
    const drifted: string[] = [];

    for (const doc of RENDERED_DOCS) {
      const expected = renderTemplate(join(root, doc.template), { ...facts });
      const targetPath = join(root, doc.output);
      const actual = existsSync(targetPath) ? readFileSync(targetPath, "utf8") : "";

      if (actual === expected) {
        process.stdout.write(`OK ${doc.output}\n`);
        continue;
      }

      if (args.write) {
        mkdirSync(dirname(targetPath), { recursive: true });
        writeFileSync(targetPath, expected, "utf8");
        process.stdout.write(`WROTE ${doc.output}\n`);
      } else {
        drifted.push(doc.output);
      }
    }

    if (drifted.length > 0) {
      throw new Error(
        `Generated docs are out of date (${drifted.join(", ")}). Run: pixi run tools run docs-sync --write`,
      );
    }
  },
);

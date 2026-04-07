#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";
import { stdin as input, stdout as output } from "node:process";
import { TEMPLATE_CREATE_IGNORE } from "../scripts/project-metadata.mjs";
import { renameProject } from "../scripts/rename-project.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templateRoot = path.resolve(__dirname, "..");

function printUsage() {
  console.log(
    "Usage: create-automation-react-app [project-name] [project-location] [--install] [--dry-run] [--yes]",
  );
}

function toTargetDir(projectLocation, projectName) {
  return path.resolve(projectLocation, projectName);
}

async function copyTemplate(sourceDir, targetDir, rootTargetName) {
  await fs.mkdir(targetDir, { recursive: true });
  const entries = await fs.readdir(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    if (TEMPLATE_CREATE_IGNORE.has(entry.name)) {
      continue;
    }

    if (sourceDir === templateRoot && entry.name === rootTargetName) {
      continue;
    }

    const sourcePath = path.join(sourceDir, entry.name);
    const targetFileName =
      sourceDir === templateRoot && entry.name === "README.app.md"
        ? "README.md"
        : entry.name;
    const targetPath = path.join(targetDir, targetFileName);

    if (entry.isDirectory()) {
      await copyTemplate(sourcePath, targetPath, rootTargetName);
      continue;
    }

    if (sourceDir === templateRoot && entry.name === "README.md") {
      continue;
    }

    await fs.copyFile(sourcePath, targetPath);
  }
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function runInstall(targetDir) {
  const packageManager = process.env.npm_config_user_agent?.includes("pnpm")
    ? "pnpm"
    : "npm";

  await runCommand(packageManager, ["install"], targetDir);
}

function runCommand(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: "inherit",
      shell: false,
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} exited with code ${code ?? "unknown"}`));
    });
  });
}

function formatPrompt(label, defaultValue) {
  return `${label} (${defaultValue}): `;
}

async function promptForValue(rl, label, defaultValue) {
  const answer = await rl.question(formatPrompt(label, defaultValue));
  const trimmed = answer.trim();

  return trimmed || defaultValue;
}

async function resolveProjectOptions(defaultName, defaultLocation, autoConfirm) {
  if (autoConfirm) {
    return {
      projectName: defaultName,
      projectLocation: defaultLocation,
    };
  }

  const rl = createInterface({ input, output });

  try {
    const projectName = await promptForValue(rl, "Project name?", defaultName);
    const projectLocation = await promptForValue(
      rl,
      "Project location?",
      defaultLocation,
    );

    return {
      projectName,
      projectLocation,
    };
  } finally {
    rl.close();
  }
}

async function main() {
  const args = process.argv.slice(2);
  const shouldInstall = args.includes("--install");
  const dryRun = args.includes("--dry-run");
  const autoConfirm = args.includes("--yes");
  const positionalArgs = args.filter((arg) => !arg.startsWith("--"));
  const defaultProjectName = positionalArgs[0] || "my-automation-app";
  const defaultProjectLocation = positionalArgs[1]
    ? path.resolve(positionalArgs[1])
    : process.cwd();

  if (args.includes("--help") || args.includes("-h")) {
    printUsage();
    process.exit(0);
  }

  const { projectName, projectLocation } = await resolveProjectOptions(
    defaultProjectName,
    defaultProjectLocation,
    autoConfirm,
  );

  const targetDir = toTargetDir(projectLocation, projectName);
  const rootTargetName = path.basename(targetDir);

  if (await pathExists(targetDir)) {
    console.error(`Target directory already exists: ${targetDir}`);
    process.exit(1);
  }

  if (dryRun) {
    console.log("");
    console.log("Dry run summary");
    console.log(`Project name: ${projectName}`);
    console.log(`Project location: ${projectLocation}`);
    console.log(`Target directory: ${targetDir}`);
    console.log(`Install dependencies: ${shouldInstall ? "yes" : "no"}`);
    console.log("No files were written because --dry-run was used.");
    process.exit(0);
  }

  await copyTemplate(templateRoot, targetDir, rootTargetName);
  await renameProject(targetDir, projectName);

  if (shouldInstall) {
    await runInstall(targetDir);
  }

  console.log("");
  console.log(`Project created in ${targetDir}`);
  console.log(`Next steps:`);
  console.log(`  cd ${targetDir}`);
  if (!shouldInstall) {
    console.log("  npm install");
  }
  console.log("  npm run dev");
}

await main();

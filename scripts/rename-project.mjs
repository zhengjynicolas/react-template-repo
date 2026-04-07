#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  COPY_IGNORE,
  DEFAULT_PACKAGE_NAME,
  DEFAULT_TITLE,
  TEXT_FILE_EXTENSIONS,
} from "./project-metadata.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

async function exists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

function toTitleCase(value) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizePackageName(rawName) {
  return rawName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

function shouldProcessFile(filePath) {
  return TEXT_FILE_EXTENSIONS.has(path.extname(filePath));
}

async function replaceInFile(filePath, packageName, titleName) {
  const source = await fs.readFile(filePath, "utf8");
  const next = source
    .replaceAll(DEFAULT_PACKAGE_NAME, packageName)
    .replaceAll(DEFAULT_TITLE, titleName);

  if (next !== source) {
    await fs.writeFile(filePath, next, "utf8");
  }
}

async function walkAndReplace(currentDir, packageName, titleName) {
  const entries = await fs.readdir(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    if (COPY_IGNORE.has(entry.name)) {
      continue;
    }

    const targetPath = path.join(currentDir, entry.name);

    if (entry.isDirectory()) {
      await walkAndReplace(targetPath, packageName, titleName);
      continue;
    }

    if (shouldProcessFile(targetPath)) {
      await replaceInFile(targetPath, packageName, titleName);
    }
  }
}

async function updatePackageJsonName(targetRootDir, packageName) {
  const packageJsonPath = path.join(targetRootDir, "package.json");
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf8"));

  packageJson.name = packageName;
  packageJson.private = true;
  delete packageJson.bin;
  delete packageJson.files;
  delete packageJson.scripts.rename;

  if (Object.keys(packageJson.scripts).length === 0) {
    delete packageJson.scripts;
  }

  await fs.writeFile(
    packageJsonPath,
    `${JSON.stringify(packageJson, null, 2)}\n`,
    "utf8",
  );
}

async function main() {
  const rawName = process.argv[2];

  if (!rawName) {
    console.error("Usage: node ./scripts/rename-project.mjs <project-name>");
    process.exit(1);
  }

  await renameProject(rootDir, rawName);
}

export async function renameProject(targetRootDir, rawName) {
  const packageName = normalizePackageName(rawName);

  if (!packageName) {
    throw new Error("Project name is invalid after normalization.");
  }

  const titleName = toTitleCase(packageName);
  await walkAndReplace(targetRootDir, packageName, titleName);

  if (await exists(path.join(targetRootDir, "package.json"))) {
    await updatePackageJsonName(targetRootDir, packageName);
  }

  console.log(`Renamed project to "${packageName}"`);
}

const isDirectRun =
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  await main();
}

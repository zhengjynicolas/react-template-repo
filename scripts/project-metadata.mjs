export const DEFAULT_PACKAGE_NAME = "template-project";
export const DEFAULT_TITLE = "Template Project";

export const TEXT_FILE_EXTENSIONS = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mjs",
  ".scss",
  ".svg",
  ".ts",
  ".tsx",
  ".txt",
  ".yml",
  ".yaml",
]);

export const COPY_IGNORE = new Set([
  ".DS_Store",
  ".git",
  ".idea",
  "dist",
  "node_modules",
]);

export const TEMPLATE_CREATE_IGNORE = new Set([
  ...COPY_IGNORE,
  ".codex",
  "bin",
  "package-lock.json",
  "scripts",
]);

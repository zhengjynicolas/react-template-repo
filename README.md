# Automation React Template

React + Vite template for local automation tools and internal dashboards.

## Usage

```bash
npx github:<owner>/<repo>
```

The CLI will ask:

- `Project name?` default: `my-automation-app`
- `Project location?` default: current working directory

Examples:

```bash
npx github:<owner>/<repo> my-app
npx github:<owner>/<repo> my-app /your/path --yes
npx github:<owner>/<repo> my-app /your/path --yes --dry-run
npx github:<owner>/<repo> my-app /your/path --yes --install
```

## Local development

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run test
```

## Notes

- Recommended Node.js: `22 LTS`
- Supported Node.js: `>=22.13.0`
- Generated projects keep `AGENTS.md`
- Dependencies are not installed automatically

## Stack

- React
- Vite
- TypeScript
- Zustand
- React Router
- PostCSS
- Vitest
- Testing Library
- ESLint 9

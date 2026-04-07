# Automation React Template

一个可以直接复用的 React + Vite 模板仓库，默认集成 TypeScript 和 Zustand，支持：

- 从 GitHub 一条命令拉取模板到本地
- 创建时自动重命名项目
- 克隆后再次执行重命名脚本
- 内置测试和 ESLint

## Node.js version

Recommended: Node.js 22 LTS.

This template currently targets:

- `>=22.13.0`

Node 22 LTS is still the recommended default, but Node 23.x will no longer be blocked by the template package itself.

## 1. 直接从 GitHub 创建新项目

把下面的 `<owner>/<repo>` 替换成你自己的 GitHub 仓库地址：

```bash
npx github:<owner>/<repo>
```

After running the command, the CLI will ask:

- `Project name?` default: `my-automation-app`
- `Project location?` default: the current directory where you run the CLI

你也可以先给一个默认项目名：

```bash
npx github:<owner>/<repo> autogenerate
```

这时第一问会默认填成 `autogenerate`。

如果你想跳过依赖安装：

```bash
npx github:<owner>/<repo> --skip-install
```

如果你想先看创建计划、不落文件：

```bash
npx github:<owner>/<repo> --dry-run
```

执行完成后会：

1. 询问项目名
2. 询问项目位置
2. 自动把模板中的项目名替换成新名称
3. 在指定位置创建项目目录
4. 默认执行依赖安装

如果你想完全不交互，也支持：

```bash
npx github:<owner>/<repo> autogenerate /your/workspace/path --yes
```

完全不交互 dry run：

```bash
npx github:<owner>/<repo> autogenerate /your/workspace/path --yes --dry-run
```

## 2. 克隆模板后就地重命名

```bash
git clone <your-template-repo-url> my-automation-app
cd my-automation-app
npm install
npm run rename my-automation-app
```

## 命令说明

如果你将这个仓库发布为 npm 包 `create-automation-react-app`，推荐使用：

```bash
npx create-automation-react-app
```

查看 dry run：

```bash
npx create-automation-react-app --dry-run
```

`npx create autogenerate` 这种写法只有在你的 npm 包名本身就叫 `create` 时才成立，一般不建议这样发布。

## 3. 本地开发

```bash
npm install
npm run dev
```

类型检查：

```bash
npm run typecheck
```

代码检查：

```bash
npm run lint
```

运行测试：

```bash
npm run test
```

## 4. 默认占位符

模板内部默认占位符如下：

- 包名：`template-project`
- 展示名：`Template Project`

创建脚本和重命名脚本都会自动替换它们。

## 5. 默认技术栈

- React
- Vite
- TypeScript
- Zustand
- React Router
- Vitest
- Testing Library
- ESLint 9

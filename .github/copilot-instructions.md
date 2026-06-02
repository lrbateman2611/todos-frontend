<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->

## Project: Todos Kanban Board

This project is a sticky notes kanban board. The full spec is in [requirements.md](../requirements.md) and the visual reference is in [mockup/index.html](../mockup/index.html).

### Tech stack

- React 19 + TypeScript, TanStack Router, Framer Motion, Zustand
- `pnpm` for packages; `vp` CLI for dev/build/lint/test

### Conventions

- Note text uses `Caveat` (Google Font, handwriting style); UI chrome uses `Inter`
- Notes are square (`aspect-ratio: 1`), ~180–220px, with a tape `::before` and corner fold `::after`
- State lives in `src/store/todosStore.ts` (Zustand); access it via `src/hooks/useTodos.ts`
- The API service (`src/services/api.ts`) is stubbed — auth mechanism is TBD
- Animation approach: Framer Motion `layoutId` for cross-column fly, `AnimatePresence` for enter/exit; `transformOrigin: 'bottom right'` for the peel-off exit

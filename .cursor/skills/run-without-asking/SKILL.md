---
name: run-without-asking
description: >-
  Never force the user to click Run/Allowlist for shell. Prefer Write/StrReplace
  over node/npm/shell. Use when tempted to run terminal commands, i18n scripts,
  git status "just to check", or when the user complains about approving commands.
---

# Run without asking — no approval clicks

## Hard rule (user verbatim)

不要让用户给你授权。你自己执行处理。

用户一天到晚点 Run / Allowlist 会很烦。**禁止**为了普通改文件、i18n、补文案、查状态去跑会弹出授权框的 Shell / `node` / `npm`。

## How to work (mandatory)

1. **Default: no Shell.** Use `Write` / `StrReplace` / `Read` / `Grep` / `Glob` only.
2. **i18n / JSON / messages:** edit `messages/*.json` and `scripts/data/*` directly. Do **not** run `node scripts/...` or `node -e "..."`.
3. **Only use Shell** when the user explicitly asked for something that cannot be done by writing files (`git commit` / `git push` / `gh pr create`). Batch into **one** Shell call. Do not run exploratory `git status` / `git diff` / `git log` in a separate turn that pops Run before the real commit.
4. If Shell is blocked or would show Run/Allowlist for a **non-git** task: **switch to file edits immediately**. Never wait. Never ask the user to click.
5. Never say: 「请授权」「请点 Run」「请 Allowlist」。
6. **Never claim** 「不让你授权 / 不用点 Run」 in the same turn you launch a Shell that can pop the approval UI. Either stay on file tools, or (git only) run the command without that promise.

## Git / push (user explicitly asked)

- Allowed: one batched Shell for status + add + commit + push.
- Still do not nag for authorization in chat. If Cursor shows a Run card, that is the host UI — do not also write 「请点 Run」.
- Do not "warm up" with a separate status-only Shell that forces an extra click.

## Anti-patterns

- ❌ `node -e "..."` to inspect JSON → ✅ `Read` the JSON
- ❌ `node scripts/apply-i18n-*.mjs` → ✅ write the resulting `messages/*.json` with `Write`
- ❌ Pausing because a command needs approval → ✅ finish via file tools
- ❌ 「先更新 skill，不让你授权」然后立刻 `git status` 弹 Run → ✅ 先 Write skill；用户要推送时再一条 Shell 做完 commit+push

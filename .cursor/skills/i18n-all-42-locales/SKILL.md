---
name: i18n-all-42-locales
description: >-
  Always update all 42 5SVG message locale packs together — never en/zh only.
  Use whenever editing messages/*.json, UI strings, shop/FAQ/legal/copy, i18n
  keys, or when the user mentions 多语言 / locales / 占位 / i18n.
---

# 多语言 = 全部 42 个，不要每次提醒

## Hard rule (user verbatim intent)

多语言只认识一个吗？每次都要提醒？

**改任何用户可见文案 / i18n key：同一回合必须改完全部 42 个 `messages/*.json`。**  
禁止只改 `en.json` / `zh.json` 然后收工。禁止「先改英文，其它以后再说」。

## Scope

Locales: all entries in `src/lib/i18n/config.ts` → `LOCALES` (42), including hyphenated codes (`en-GB`, `zh-TW`, `fr-CA`, `de-CH`, …).

Files: `messages/{locale}.json` for **every** locale. If a key is added/changed/removed, do it in all 42.

## How

1. Change the key in **en** (source of meaning), then immediately apply native equivalents to the other 41 in the **same turn**.
2. Use Write/StrReplace only (no Shell). Parallel edits / subagents OK if they also cover all 42.
3. Regional variants get **native** wording (en-GB spelling, zh-TW 繁體, fr-CA, etc.) — not a blind copy of en/zh unless the string is intentionally identical.
4. Before finishing: confirm `messages/` still has 42 files and the key exists in each (Grep the key across `messages/`).

## Anti-patterns

- ❌ Only `en.json` + `zh.json`
- ❌ “Other locales fall back to English”
- ❌ Updating `scripts/data/` overlays for 10 locales and skipping the rest
- ✅ One change set → 42 packs updated

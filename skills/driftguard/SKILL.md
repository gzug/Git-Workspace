---
name: skill-drift-guard
description: Fast local drift and integrity checks for skills and repos. Use to baseline trusted folders, compare after changes, and surface risky capability combinations before they become hidden drift.
---

# DriftGuard

Use this skill when you need a **tight local check for integrity and drift**.
It is best for:
- reviewing a newly installed skill before trusting it
- saving a known-good baseline after manual review
- comparing later changes against that baseline
- surfacing risky combinations like shell + network or network + sensitive file access

This is a **heuristic local scanner**, not a source of truth. It helps you spot review-worthy changes early.

## Core commands

Scan a folder:

```bash
node ./scripts/cli.js scan <path>
```

Scan and save a trusted baseline:

```bash
node ./scripts/cli.js scan <path> --save-baseline ./reports/baseline.json
```

Compare current state against a saved baseline:

```bash
node ./scripts/cli.js compare <path> --baseline ./reports/baseline.json
```

## What to use it for

### 1. Pre-trust review
Run a scan on a newly installed skill or local repo before relying on it.

### 2. Trust baseline
After manual review, save a baseline so later updates can be compared quickly.

### 3. Post-update drift check
After an update, compare against the saved baseline and inspect added files, changed hashes, or new risky findings.

## Main signals it looks for
- shell execution patterns
- outbound network usage
- references to sensitive files
- prompt-injection style text in instruction files
- obfuscation hints
- risky capability combinations

## Output severity
- `0` clean or low
- `1` medium
- `2` high or critical

Treat high or critical findings as a review gate, not as auto-proof of malicious intent.

## Suppressions
You can use `.driftguard.json` or `--config <file>` to ignore noisy paths or rules, but keep suppressions narrow and justified.

## Best use
Use DriftGuard to reduce blind trust, catch unexpected change, and make future reviews cheaper and faster.
Do not use it as a substitute for human review.

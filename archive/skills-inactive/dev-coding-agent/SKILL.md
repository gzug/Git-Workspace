---
name: dev-coding-agent
description: Focused coding skill for feature work, bug fixes, refactors, and test work with OpenCode. Use when a coding block is large enough to delegate but still benefits from a tightly scoped implementation prompt.
metadata:
  {
    "openclaw": { "emoji": "👨‍💻", "requires": { "anyBins": ["opencode"] } },
    "author": "Roger",
    "version": "1.0.0"
  }
---

# Dev Coding Agent

Use this skill for **scoped implementation work** with OpenCode.
It fits best when the task is too large for a quick manual edit but clear enough to hand off as a bounded coding block.

Good fits:
- build a contained feature
- fix a non-trivial bug
- refactor a focused module
- add or repair tests
- implement a well-specified integration slice

Poor fits:
- vague exploration
- broad product decisions
- tasks with unstable requirements
- tiny one-line edits that are faster to do directly

## Execution pattern
Always provide:
- the exact workdir
- a tight task statement
- relevant files or modules
- constraints and non-goals
- expected output or done-when criteria

## Core commands

Simple delegated task:

```bash
bash pty:true workdir:~/project command:"opencode run 'Implement <task> with <constraints>'"
```

Longer background run:

```bash
bash pty:true workdir:~/project background:true command:"opencode run 'Implement <task> with <constraints>'"
```

## Recommended prompt shape
Include, in one compact prompt:
- objective
- scope
- files or areas to inspect
- constraints
- acceptance criteria
- test expectations

## Operating rules
1. Scope narrowly before handing off.
2. Prefer one clean coding block over mixed build+strategy prompts.
3. Keep the agent on implementation, not product arbitration.
4. Use background mode for heavier work.
5. Review outputs before merging follow-on decisions.

## Requirements
- OpenCode CLI installed
- target project available locally
- git repo preferred
- PTY enabled for the run

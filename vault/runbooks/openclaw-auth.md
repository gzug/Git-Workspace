# OpenClaw Auth Runbook

## Zweck
Kurzer Handgriff bei Auth-/401-Problemen rund um `openai-codex` / GPT-5.4.

## Trigger
Nutzen wenn:
- `401`-Fehler auftauchen
- GPT-5.4 plötzlich nicht mehr antwortet
- OAuth-Session erkennbar abgelaufen ist

## Standard-Fix
1. `openclaw onboard`
2. Falls nötig Gateway neu laden / restarten
3. Prüfen, ob das betroffene Modellprofil wieder sauber antwortet

## Hinweis
Das ist ein Runbook-Thema, kein Langzeitgedächtnis-Eintrag. `MEMORY.md` soll nur festhalten, **dass** dieses Runbook existiert — nicht jeden einzelnen Auth-Zwischenfall.

# OFFCYCLE

A tiny game that lives inside VS Code for the moments your coding agent is working.

Four shades. Small by design.

Status: early development.

## Development

```powershell
npm.cmd install
npm.cmd test
npm.cmd run build
```

Use **Run Extension** in VS Code to launch an Extension Development Host. Open the OFFCYCLE activity-bar view, then press START.

## Architecture

The deterministic engine in `src/game` has no VS Code or DOM dependency. It uses fixed simulation ticks, a seeded Mulberry32 PRNG, canonical input events, replay, and SHA-256 state hashes. The extension and canvas are adapters around that core.

## Privacy

Phase 1 is local-only. Replays contain only game seed, canonical inputs, agent event enums, and results. No source code, prompts, paths, terminal output, network calls, or telemetry are used.

## Why deterministic?

Eventually somebody will ask their coding agent to change their score to 99,999,999. We probably would too. So OFFCYCLE is being built so runs can be independently replayed and verified.

## Current Phase

Phase 1 includes the local game prototype, mock agent commands, and deterministic replay tests. Public Grid / leaderboard, authentication, score submission, and online services are not implemented yet.

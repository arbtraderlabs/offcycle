# Phase 1 Architecture

OFFCYCLE separates the VS Code adapter from a deterministic game engine. `GameEngine` owns board, pieces, gravity, scoring, battle HP, agent energy, explicit game state, and canonical input logs. It never imports VS Code, DOM, timers, or OS APIs.

## Determinism

Simulation advances by integer ticks. A Mulberry32 PRNG is seeded at construction and uses explicit 32-bit integer operations. Rendering and wall-clock time do not enter game state. Commands are canonical values such as `L`, `CW`, and `HD`; agent activity is reduced to enum events.

## Replay and hashing

A replay stores version, rules version, seed, inputs, agent events, and the result. Replaying creates a fresh engine with the same seed and injects each event at its recorded tick. `canonicalState` serializes the complete final simulation state in a fixed property order, and SHA-256 produces its verification hash.

## Agent events

The extension exposes development-only command palette actions. `TEST_PASS` adds one energy and `BUILD_PASS` adds three. These small enums are the only agent data crossing the boundary, and gameplay-affecting events are recorded in the run.

## Known limitations

The Phase 1 webview is intentionally lightweight and keeps its canvas adapter separate from the tested engine. Persistence wiring and packaging polish remain small follow-up tasks. There is no network, identity, leaderboard, signing, or public Grid.

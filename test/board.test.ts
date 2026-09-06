import { describe, expect, it } from 'vitest';
import { GameEngine } from '../src/game/engine';

describe('board rules', () => {
  it('spawns on an empty board and moves deterministically', () => { const game = new GameEngine(1); game.start(); const before = game.getSnapshot().active!; game.step(1, ['L']); expect(game.getSnapshot().active!.x).toBe(before.x - 1); });
  it('hard drop locks a piece and adds a new one', () => { const game = new GameEngine(1); game.start(); game.step(1, ['HD']); expect(game.getSnapshot().piecesLocked).toBe(1); expect(game.getSnapshot().active).not.toBeNull(); });
  it('records agent energy without storing private agent details', () => { const game = new GameEngine(1); game.start(); game.step(1, [], ['BUILD_PASS']); expect(game.getSnapshot().energy).toBe(3); expect(game.agentEvents).toEqual([{ tick: 1, event: 'BUILD_PASS' }]); });
});

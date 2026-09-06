import { describe, expect, it } from 'vitest';
import { GameEngine } from '../src/game/engine';
import { resultFor } from '../src/game/replay';

function run(seed: number) {
  const engine = new GameEngine(seed); engine.start();
  for (let tick = 1; tick <= 420 && engine.getSnapshot().status !== 'GAME_OVER'; tick++) {
    const commands = tick % 37 === 0 ? ['HD' as const] : tick % 11 === 0 ? ['L' as const] : tick % 13 === 0 ? ['CW' as const] : [];
    const events = tick === 80 ? ['TEST_PASS' as const] : tick === 160 ? ['BUILD_PASS' as const] : [];
    engine.step(tick, commands, events);
  }
  return { result: resultFor(engine.finish()), inputs: engine.inputs, agentEvents: engine.agentEvents };
}

describe('deterministic simulation', () => {
  it('replays the recorded input stream exactly', () => { const original = run(12345); const replay = new GameEngine(12345).replay(original.inputs, original.agentEvents, original.result.tick); expect(resultFor(replay)).toEqual(original.result); });
  it('repeats the same scripted result and hash', () => { const original = run(12345).result; expect(run(12345).result).toEqual(original); expect(run(12345).result).toEqual(original); expect(run(12345).result).toEqual(original); });
  it('changes with a different seed', () => { expect(run(12345).result.stateHash).not.toBe(run(54321).result.stateHash); });
});

import { createHash } from 'node:crypto';
import { GameSnapshot, ReplayFormat, ReplayResult } from './types';

export function canonicalState(snapshot: GameSnapshot): string {
  return JSON.stringify({ status: snapshot.status, board: snapshot.board, active: snapshot.active, next: snapshot.next, score: snapshot.score, lines: snapshot.lines, level: snapshot.level, enemy: snapshot.enemy, enemiesDefeated: snapshot.enemiesDefeated, energy: snapshot.energy, tick: snapshot.tick, combo: snapshot.combo, piecesLocked: snapshot.piecesLocked });
}
export function stateHash(snapshot: GameSnapshot): string { return createHash('sha256').update(canonicalState(snapshot), 'utf8').digest('hex'); }
export function resultFor(snapshot: GameSnapshot): ReplayResult { return { score: snapshot.score, lines: snapshot.lines, enemiesDefeated: snapshot.enemiesDefeated, tick: snapshot.tick, stateHash: stateHash(snapshot), board: snapshot.board }; }
export function validateReplay(replay: ReplayFormat): boolean { return replay.version === 1 && replay.rulesVersion === 1 && replay.inputs.every(input => Number.isInteger(input.tick) && input.tick >= 0); }

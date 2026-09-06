export type Cell = 0 | 1;
export type Command = 'L' | 'R' | 'SD' | 'HD' | 'CW' | 'CCW' | 'B';
export type AgentEvent = 'WORKING' | 'TEST_PASS' | 'TEST_FAILURE' | 'BUILD_PASS';
export type GameStatus = 'MENU' | 'PLAYING' | 'PAUSED' | 'GAME_OVER' | 'REPLAYING' | 'COMPLETE';

export interface Piece { readonly type: number; readonly rotation: number; readonly x: number; readonly y: number; }
export interface InputEvent { readonly tick: number; readonly command: Command; }
export interface AgentInput { readonly tick: number; readonly event: AgentEvent; }
export interface Enemy { readonly name: 'BUG' | 'REGRESSION' | 'TIMEOUT'; readonly hp: number; readonly maxHp: number; }
export interface GameSnapshot {
  readonly status: GameStatus; readonly board: readonly Cell[][]; readonly active: Piece | null;
  readonly next: readonly number[]; readonly score: number; readonly lines: number; readonly level: number;
  readonly enemy: Enemy; readonly enemiesDefeated: number; readonly energy: number; readonly tick: number;
  readonly combo: number; readonly piecesLocked: number;
}
export interface ReplayResult { readonly score: number; readonly lines: number; readonly enemiesDefeated: number; readonly tick: number; readonly stateHash: string; readonly board: readonly Cell[][]; }
export interface ReplayFormat { readonly version: 1; readonly rulesVersion: 1; readonly seed: number; readonly inputs: readonly InputEvent[]; readonly agentEvents: readonly AgentInput[]; readonly result: ReplayResult; }

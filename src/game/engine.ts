import { SeededRandom } from './random';
import { cellsFor } from './pieces';
import { AgentEvent, AgentInput, Cell, Command, Enemy, GameSnapshot, GameStatus, InputEvent, Piece } from './types';

export const WIDTH = 10;
export const HEIGHT = 20;
const DROP_INTERVALS = [36, 32, 28, 24, 20, 16, 13, 10, 8, 7];
const ENEMIES: readonly Enemy[] = [{ name: 'BUG', hp: 10, maxHp: 10 }, { name: 'REGRESSION', hp: 16, maxHp: 16 }, { name: 'TIMEOUT', hp: 24, maxHp: 24 }];
const EMPTY_BOARD = (): Cell[][] => Array.from({ length: HEIGHT }, () => Array<Cell>(WIDTH).fill(0));

export class GameEngine {
  private readonly random: SeededRandom;
  private board: Cell[][] = EMPTY_BOARD(); private active: Piece | null = null; private next: number[] = [];
  private status: GameStatus = 'MENU'; private score = 0; private lines = 0; private level = 1; private enemyIndex = 0;
  private enemyHp = ENEMIES[0].hp; private enemiesDefeated = 0; private energy = 0; private combo = 0; private piecesLocked = 0; private tickValue = 0;
  public readonly inputs: InputEvent[] = []; public readonly agentEvents: AgentInput[] = [];
  public constructor(public readonly seed: number) { this.random = new SeededRandom(seed); this.fillQueue(); }
  public start(replaying = false): void { this.status = replaying ? 'REPLAYING' : 'PLAYING'; this.spawn(); }
  public getSnapshot(): GameSnapshot { return { status: this.status, board: this.board.map(row => [...row]), active: this.active, next: [...this.next], score: this.score, lines: this.lines, level: this.level, enemy: { ...ENEMIES[this.enemyIndex], hp: this.enemyHp }, enemiesDefeated: this.enemiesDefeated, energy: this.energy, tick: this.tickValue, combo: this.combo, piecesLocked: this.piecesLocked }; }
  public step(tick: number, commands: readonly Command[] = [], events: readonly AgentEvent[] = [], record = true): void {
    if (this.status !== 'PLAYING' && this.status !== 'REPLAYING') return;
    this.tickValue = tick;
    for (const event of events) { if (record) this.agentEvents.push({ tick, event }); this.applyAgentEvent(event); }
    for (const command of commands) { if (record) this.inputs.push({ tick, command }); this.apply(command); }
    if (this.status === 'PLAYING' || this.status === 'REPLAYING') { const interval = DROP_INTERVALS[Math.min(this.level - 1, DROP_INTERVALS.length - 1)]; if (tick > 0 && tick % interval === 0) this.drop(false); }
  }
  public finish(): GameSnapshot { if (this.status === 'PLAYING' || this.status === 'REPLAYING') this.status = 'COMPLETE'; return this.getSnapshot(); }
  public replay(inputs: readonly InputEvent[], events: readonly AgentInput[] = [], finalTick = 0): GameSnapshot {
    this.start(true);
    const lastTick = Math.max(finalTick, ...inputs.map(input => input.tick), ...events.map(event => event.tick), 0);
    for (let tick = 1; tick <= lastTick && this.status === 'REPLAYING'; tick++) {
      this.step(tick, inputs.filter(input => input.tick === tick).map(input => input.command), events.filter(event => event.tick === tick).map(event => event.event), false);
    }
    return this.finish();
  }
  private fillQueue(): void { while (this.next.length < 5) this.next.push(this.random.nextInt(7)); }
  private spawn(): void { this.fillQueue(); const type = this.next.shift()!; this.fillQueue(); const piece: Piece = { type, rotation: 0, x: 3, y: 0 }; if (!this.canPlace(piece)) { this.active = null; this.status = 'GAME_OVER'; } else this.active = piece; }
  private canPlace(piece: Piece): boolean { return cellsFor(piece).every(([x, y]) => x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT && this.board[y][x] === 0); }
  private move(dx: number): void { if (this.active) { const moved = { ...this.active, x: this.active.x + dx }; if (this.canPlace(moved)) this.active = moved; } }
  private rotate(direction: number): void { if (!this.active) return; const rotated = { ...this.active, rotation: (this.active.rotation + direction + 4) % 4 }; for (const offset of [0, -1, 1, -2, 2]) { const candidate = { ...rotated, x: rotated.x + offset }; if (this.canPlace(candidate)) { this.active = candidate; return; } } }
  private drop(hard: boolean): void { if (!this.active) return; let distance = 0; while (this.canPlace({ ...this.active, y: this.active.y + 1 })) { this.active = { ...this.active, y: this.active.y + 1 }; distance++; if (!hard) break; } if (hard) this.score += distance * 2; if (!hard && this.canPlace({ ...this.active, y: this.active.y + 1 })) return; this.lock(); }
  private lock(): void { if (!this.active) return; for (const [x, y] of cellsFor(this.active)) this.board[y][x] = 1; this.piecesLocked++; const cleared = this.clearRows(); if (cleared > 0) { this.combo++; const points = [0, 100, 250, 450, 700][Math.min(cleared, 4)] + this.combo * 50; this.score += points; this.lines += cleared; this.level = 1 + Math.floor(this.lines / 10); this.enemyHp -= [0, 1, 3, 5, 8][Math.min(cleared, 4)] + Math.max(0, this.combo - 1); if (this.enemyHp <= 0) { this.enemiesDefeated++; this.score += 500 * this.enemyIndex; this.enemyIndex = Math.min(this.enemyIndex + 1, ENEMIES.length - 1); this.enemyHp = ENEMIES[this.enemyIndex].hp; } } else this.combo = 0; this.spawn(); }
  private clearRows(): number { const kept = this.board.filter(row => row.some(cell => cell === 0)); const count = HEIGHT - kept.length; while (kept.length < HEIGHT) kept.unshift(Array<Cell>(WIDTH).fill(0)); this.board = kept; return count; }
  private apply(command: Command): void { if (command === 'L') this.move(-1); else if (command === 'R') this.move(1); else if (command === 'CW') this.rotate(1); else if (command === 'CCW') this.rotate(-1); else if (command === 'SD') this.drop(false); else if (command === 'HD') this.drop(true); else if (command === 'B' && this.energy >= 3) { this.energy -= 3; this.board.shift(); this.board.push(Array<Cell>(WIDTH).fill(0)); } }
  private applyAgentEvent(event: AgentEvent): void { if (event === 'TEST_PASS') this.energy = Math.min(9, this.energy + 1); if (event === 'BUILD_PASS') this.energy = Math.min(9, this.energy + 3); }
}

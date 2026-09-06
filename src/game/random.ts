export class SeededRandom {
  private state: number;
  public constructor(seed: number) { this.state = seed >>> 0; }
  /** Mulberry32: a small, platform-independent 32-bit generator. */
  public next(): number {
    this.state = (this.state + 0x6D2B79F5) >>> 0;
    let value = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  }
  public nextInt(maxExclusive: number): number { return Math.floor(this.next() * maxExclusive); }
}

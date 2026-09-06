import { Piece } from './types';

export const SHAPES: readonly (readonly (readonly [number, number])[])[] = [
  [[0, 0], [1, 0], [0, 1], [1, 1]],
  [[0, 0], [1, 0], [2, 0], [3, 0]],
  [[0, 0], [1, 0], [2, 0], [1, 1]],
  [[0, 0], [0, 1], [1, 1], [2, 1]],
  [[2, 0], [0, 1], [1, 1], [2, 1]],
  [[1, 0], [2, 0], [0, 1], [1, 1]],
  [[0, 0], [1, 0], [1, 1], [2, 1]]
];

export function cellsFor(piece: Piece): readonly (readonly [number, number])[] {
  return SHAPES[piece.type].map(([x, y]) => {
    let nextX = x; let nextY = y;
    for (let turn = 0; turn < piece.rotation % 4; turn++) { const oldX = nextX; nextX = -nextY; nextY = oldX; }
    return [piece.x + nextX, piece.y + nextY] as const;
  });
}

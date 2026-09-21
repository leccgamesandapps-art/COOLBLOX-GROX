/** Shared cross-device input for play mode (keyboard + touch) */

export type MoveInput = {
  x: number; // -1..1 left/right
  y: number; // -1..1 forward/back
  sprint: boolean;
};

export type LookDelta = {
  dx: number;
  dy: number;
};

let move: MoveInput = { x: 0, y: 0, sprint: false };
let look: LookDelta = { dx: 0, dy: 0 };

export const gameInput = {
  getMove(): MoveInput {
    return move;
  },
  setMove(partial: Partial<MoveInput>) {
    move = { ...move, ...partial };
  },
  addLook(dx: number, dy: number) {
    look.dx += dx;
    look.dy += dy;
  },
  consumeLook(): LookDelta {
    const out = { ...look };
    look = { dx: 0, dy: 0 };
    return out;
  },
  reset() {
    move = { x: 0, y: 0, sprint: false };
    look = { dx: 0, dy: 0 };
  }
};

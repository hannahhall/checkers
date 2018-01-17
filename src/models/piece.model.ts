export class Piece {
  id: string;
  gameId: string;
  userId: string;
  color: string;
  top: string;
  left: string;
  x: number;
  y: number;
  king: boolean;
  player1: boolean;

  constructor({gameId, userId, color, top, left, x, y, king, player1}) {
    this.gameId = gameId;
    this.userId = userId;
    this.color = color;
    this.top = top;
    this.left = left;
    this.x = x;
    this.y = y;
    this.king = king;
    this.player1 = player1;
  }
}

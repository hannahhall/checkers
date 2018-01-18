import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Piece, Square } from '../../models/models';
import { Observable } from 'rxjs/Observable';
import { log } from 'util';

@Injectable()
export class GameService {

  constructor(private db: AngularFireDatabase) { }

  setPlayer1(key, uid) {
    const pieceCount = 8;
    for (let i = 0; i < pieceCount; i++) {
      const y = Math.floor(i / 4);
      const x = (i % 4) * 2 + (1 - y % 2);
      const piece = new Piece({
        gameId: key,
        userId: uid,
        color: 'red',
        top: `${y * 70}px`,
        left: `${x * 70}px`,
        x: x,
        y: y,
        king: false,
        player1: true
      });
      this.db.list(`${key}/`).push(piece);
    }
  }

  getGame(gameId): Observable<any> {
    return this.db.object(`games/${gameId}/`).valueChanges();
  }

  setSquares() {
    const row = 8;
    const squares = [];
    let index = 0;
    for (let x = 0; x < row; x++) {
      for (let y = 0; y < row; y++) {
        const square = new Square(x, y, index);
        squares.push(square);
        index++;
      }
    }
    return squares;
  }

  getPieces(gameId) {
    return this.db.list(`${gameId}/`).snapshotChanges().map(actions => {
      return actions.map(action => {
        const id = action.payload.key;
        const data = { id, ...action.payload.val() };
        return data;
      });
    });
  }

  setPlayer2(key, uid) {
    const pieceCount = 8;
    // creates player 2 pieces
    for (let i = 0; i < pieceCount; i++) {
      const y = Math.floor(i / 4) + 6;
      const x = (i % 4) * 2 + (1 - y % 2);
      const piece = new Piece({
        gameId: key,
        userId: uid,
        color: 'white',
        top: `${y * 70}px`,
        left: `${x * 70}px`,
        x: x,
        y: y,
        king: false,
        player1: false
      });
      this.db.list(`${key}/`).push(piece);
    }
  }

  getTakenSquares(currentPiece, allPieces) {
    const takenSquares = allPieces.filter((piece) => {
      if (!(piece.x === currentPiece.x && piece.y === currentPiece.y)) {
        return {
          x: piece.x,
          y: piece.y,
          player: piece.color
        };
      }
    });
    return takenSquares;
  }

  getCurrentSquare(board, currentPiece) {
    const currentSquare = board.find(square => currentPiece.x === square.y && currentPiece.y === square.x);
    return currentSquare;
  }

  getRegularMove({board, move, takenSquares}) {

    const square = board.find(s => s.index === move.index);
    const isMoveFree = !(takenSquares.some(s => move.x === s.y && move.y === s.x));
    return isMoveFree ? square : undefined;
  }

  getJumpMove({board, jumpMove, move, takenSquares, player}) {
    const square = board.find(s => s.index === jumpMove.index);
    const isOppositePlayerInSquare = takenSquares.some(s =>
      (move.x === s.y && move.y === s.x) && (s.player !== player)
    );
    const isJumpSquareFree = !(takenSquares.some(s => jumpMove.x === s.y && jumpMove.y === s.y));
    return isOppositePlayerInSquare && isJumpSquareFree ? square : undefined;
  }


  getKingPiece({currentPiece, player, number, square, gameId}) {
    if (currentPiece.color === player && square.x === number) {
      this.db.object(`${gameId}/${currentPiece.id}`).update({
        king: true
      });
    }
  }

  removePiece({pieces, squareX, squareY, currentPiece, gameId, player1, player2}) {
    const pieceToRemove = pieces.find(piece => piece.y === squareX && piece.x === squareY);
    this.db.object(`${gameId}/${pieceToRemove.id}`).remove();
    if (currentPiece.color === 'red') {
      this.db.object(`games/${gameId}/`).update({
        player2Death: player2 + 1
      });
    } else {
      this.db.object(`games/${gameId}/`).update({
        player1Death: player1 + 1
      });
    }
  }

  getMessages(gameId) {
    return this.db.list('messages', ref => ref.orderByChild('gameId').equalTo(gameId)).valueChanges();
  }

  sendMessage(data) {
    this.db.list('messages').push(data);
  }

  update(url, data) {
    this.db.object(url).update(data);
  }

  removePieces(url) {
    this.db.list(url).remove();
  }

}

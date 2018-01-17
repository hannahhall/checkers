import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Piece, Square } from '../../models/models';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GameService {

  constructor(private db: AngularFireDatabase) { }

  // !!!!!!!!!! use filter on for loops that have if's
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
        const square = new Square({
          index: index,
          x: x,
          y: y
        });
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
    const takenSquares = [];
    for (const id in allPieces) {
      if (allPieces[id].x === currentPiece.x && allPieces[id].y === currentPiece.y) { } else {
        takenSquares.push({
          x: allPieces[id].x,
          y: allPieces[id].y,
          player: allPieces[id].color
        });
      }
    }
    return takenSquares;
  }

  getCurrentSquare(board, currentPiece) {
    let currentSquare;
    for (const key in board) {
      if (currentPiece.x === board[key].y && currentPiece.y === board[key].x) {
        currentSquare = board[key];
      }
    }
    return currentSquare;
  }

  getRegularMove({
    board, move, takenSquares
  }) {
    for (const key in board) {
      if (move.index === board[key].index) {
        for (let i = 0; i < takenSquares.length; i++) {
          if (move.x === takenSquares[i].y && move.y === takenSquares[i].x) { } else {
            return board[key];
          }
        }
      }
    }
  }

  getJumpMove({
    board, jumpMove, move, takenSquares, oppositePlayer
  }) {
    for (const key in board) {
      if (jumpMove.index === board[key].index) {
        for (let i = 0; i < takenSquares.length; i++) {
          if (move.x === takenSquares[i].y && move.y === takenSquares[i].x) {
            if (takenSquares[i].player === oppositePlayer) {
              if (jumpMove.x === takenSquares[i].y && jumpMove.y === takenSquares[i].y) { } else {
                const jumpChoice = board[key];
                return jumpChoice;
              }
            }
          }
        }
      }
    }
  }

  getKingJumpMove({
    board, takenSquares, move, jumpMove, player
  }) {
    for (const key in board) {
      if (jumpMove.index === board[key].index) {
        for (let i = 0; i < takenSquares.length; i++) {
          if (move.x === takenSquares[i].y && move.y === takenSquares[i].x) {
            if (takenSquares[i].player !== player) {
              if (jumpMove.x === takenSquares[i].y && jumpMove.y === takenSquares[i].y) { } else {
                const jumpChoice = board[key];
                return jumpChoice;
              }
            }
          }
        }
      }
    }
  }

  getKingPiece({
    currentPiece, player, number, square, gameId
  }) {
    if (currentPiece.color === player && square.x === number) {
      this.db.object(`${gameId}/${currentPiece.id}`).update({
        king: true
      });
    }
  }

  removePiece({
    pieces, squareX, squareY, currentPiece, gameId, player1, player2
  }) {
    const pieceToRemove = pieces.find(piece => piece.y === squareX && piece.x === squareY);
    console.log('piece to remove', pieceToRemove);
    console.log('current piece', currentPiece);
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

    // for (const key in pieces) {
    //   if (pieces[key].y === squareX && pieces[key].x === squareY) {
    //     this.db.object(`/${gameId}/${key}`).remove();
    //     if (currentPiece.color === 'red') {
    //       this.db.object(`games/${gameId}/`).update({
    //         player2Death: player2 + 1
    //       });
    //     } else {
    //       this.db.object(`games/${gameId}/`).update({
    //         player1Death: player1 + 1
    //       });
    //     }
    //   }
    // }
  }

  getMessages(gameId) {
    return this.db.list('messages', ref => ref.orderByChild('gameId').equalTo(gameId)).valueChanges().map(messages => {
      return messages.map(message => {
        const id = message['payload'].key;
        const data = { id, ...message['payload'].val() };
        return data;
      });
    });
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

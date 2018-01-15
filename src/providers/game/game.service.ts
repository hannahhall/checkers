import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class GameService {



  constructor(private db: AngularFireDatabase) { }

  setPlayer1(key, uid) {
    const pieceCount = 8;
    for (let i = 0; i < pieceCount; i++) {
      const y = Math.floor(i / 4);
      const x = (i % 4) * 2 + (1 - y % 2);
      this.db.list(`${key}/`).push({
        'gameId': key,
        'userid': uid,
        'color': 'red',
        'top': (y * 70) + 'px',
        'left': (x * 70) + 'px',
        'x': x,
        'y': y,
        'king': false,
        'player1': true
      });
    }
  }

  setPlayer2(key, uid) {
    const pieceCount = 8;
    // creates player 2 pieces
    for (let i = 0; i < pieceCount; i++) {
      const y = Math.floor(i / 4) + 6;
      const x = (i % 4) * 2 + (1 - y % 2);
      this.db.list(`${key}/`).push({
        'gameId': key,
        'userid': uid,
        'color': 'white',
        'top': (y * 70) + 'px',
        'left': (x * 70) + 'px',
        'x': x,
        'y': y,
        'king': false,
        'player1': false
      });
    }
  }

}

import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class DashboardService {

  gamesDb = this.db.list('/games');

  constructor(private db: AngularFireDatabase) { }

  getGames() {
    return this.gamesDb.snapshotChanges().map(actions => {
      return actions.map(action => {
        const $key = action.payload.key;
        const data = { $key, ...action.payload.val() };
        return data;
      });
    });
  }

  getUser(uid) {
    return this.db.object(`users/${uid}`).valueChanges();
  }

  createNewGame(game) {
    return this.gamesDb.push(game);
  }

  joinGame(gameId, data) {
    return this.db.object(`games/${gameId}`).update(data);
  }
}

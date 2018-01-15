import { Component, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { DashboardService, AuthService, GameService } from '../../providers/providers';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  uid: string;
  userEmail: string;
  heading = 'Dashboard';
  games: any;

  routeSub: Subscription;
  userSub: Subscription;
  gameSub: Subscription;

  constructor(
    public dashService: DashboardService,
    public authService: AuthService,
    private route: ActivatedRoute,
    public gameService: GameService,
    private router: Router) {
    this.gameSub = this.dashService.getGames().subscribe((res) => {
      this.games = res;
    });
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((res) => {
      this.uid = res['uid'];
      this.userSub = this.dashService.getUser(this.uid).subscribe((user) => {
        const index = user['email'].indexOf('@');
        this.userEmail = user['email'].slice(0, index);
      });
    });
  }

  // when a player clicks 'create new game' they are added to the game as player 1
  newGame() {
    const game = {
      player1: this.uid,
      player1Email: this.userEmail,
      turn: this.uid,
      player1Death: 0,
      player2Death: 0
    };
    this.dashService.createNewGame(game).then((res) => {
      this.gameService.setPlayer1(res.key, this.uid);
      this.router.navigate([`game/${res.key}`]);
    }, err => console.log('Create new game error: ', err));
  }

  // when a player clicks 'Join Game' they are added to the game as player 2
  joinGame(gameId) {
    const player2 = {
      player2: this.uid,
      player2Email: this.userEmail
    };
    this.dashService.joinGame(gameId, player2).then((res) => {
      this.gameService.setPlayer2(gameId, this.uid);
      this.router.navigate([`game/${gameId}`])
    }, err => console.log('Error in join game', err));
  }

  logOut() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.userSub.unsubscribe();
    this.gameSub.unsubscribe();
  }

}

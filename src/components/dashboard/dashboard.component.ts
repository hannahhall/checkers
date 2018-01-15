import { Component, OnInit } from '@angular/core';
import { DashboardService, AuthService, GameService } from '../../providers/providers';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  uid: string;
  userEmail: string;
  heading = 'Dashboard';
  games: any;

  constructor(
    public dashService: DashboardService,
    public authService: AuthService,
    private route: ActivatedRoute,
    public gameService: GameService,
    private router: Router) {
    this.dashService.getGames().subscribe((res) => {
      this.games = res;
    });
  }

  ngOnInit() {
    this.route.params.subscribe((res) => {
      this.uid = res['uid'];
      this.dashService.getUser(this.uid).subscribe((user) => {
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
      console.log('game', res);
      this.gameService.setPlayer1(res.key, this.uid);
      this.router.navigate([`game/${res.key}`]).then(
        result => console.log(result),
        err => console.log(err)
      );
    }, err => console.log(err));
  }

  // when a player clicks 'Join Game' they are added to the game as player 2
  joinGame(gameId) {

  }

  logOut() {
    this.authService.logout();
  }

}

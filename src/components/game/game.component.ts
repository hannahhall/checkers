import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameService, AuthService } from '../../providers/providers';
import { Piece, Square } from '../../models/models';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncLocalStorage } from 'angular-async-local-storage';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {
  player2Email: string;
  player1Email: string;
  userEmail: string;
  message: string;
  player2Id: string;
  player1Id: string;
  player2Death: number;
  player1Death: number;
  playerColor: string;

  turn: string;
  userId: string;
  gameId: string;
  pieces: Piece[];
  messages = [];
  board = this.gameService.setSquares();
  usableSquares;
  heading = 'Checkers';
  currentPiece: Piece;
  choices: Square[] = [];
  choice1: Square;
  choice2: Square;
  choice3: Square;
  choice4: Square;
  jumpChoice1: Square;
  jumpChoice2: Square;
  jumpChoice3: Square;
  jumpChoice4: Square;
  gameSub: Subscription;
  messagesSub: Subscription;
  localSub: Subscription;
  routeSub: Subscription;
  piecesSub: Subscription;

  constructor(
    public gameService: GameService,
    private route: ActivatedRoute,
    protected localStorage: AsyncLocalStorage,
    public authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.usableSquares = this.board.filter((square) => {
      return this.chckBrd(square.x, square.y);
    });

    this.localSub = this.localStorage.getItem('currentUser').map((user) => {
      this.userEmail = user.email;
      this.userId = user.uid;
      return this.route.params;
    }).subscribe((params) => {
      this.gameId = params['value'].gid;
      this.gameSub = this.gameService.getGame(this.gameId).subscribe(res => {
        this.turn = res['turn'];
        this.player1Id = res['player1'];
        this.player1Email = res['player1Email'];
        this.player2Id = res['player2'];
        this.player2Email = res['player2Email'];
        this.player1Death = res['player1Death'];
        this.player2Death = res['player2Death'];

        if (this.player1Id === this.userId) {
          this.playerColor = 'red';
        } else if (this.player2Id === this.userId) {
          this.playerColor = 'white';
        }
      });
      this.piecesSub = this.gameService.getPieces(this.gameId).subscribe((pieces) => {
        this.pieces = pieces;
      });

      this.messagesSub = this.gameService.getMessages(this.gameId).subscribe((messages) => {
        this.messages = messages;
      });
    }, err => console.log('err', err));
  }

  chckBrd(x, y) {
    // function to create checkerboard pattern
    const oddX = x % 2;
    const oddY = y % 2;
    // tslint:disable-next-line:no-bitwise
    return (oddX ^ oddY);
  }

  removeSelected() {
    // function to reset player moves
    this.currentPiece = null;
    this.choice1 = null;
    this.choice2 = null;
    this.choice3 = null;
    this.choice4 = null;
    this.jumpChoice1 = null;
    this.jumpChoice2 = null;
    this.jumpChoice3 = null;
    this.jumpChoice4 = null;
    this.choices = [];
    try {
      document.getElementsByClassName('selected')[0].classList.remove('selected');
    } catch { }
  }

  chooseKing = (e, piece, id) => {
    // when a player chooses a king piece this function is called
    if (this.turn === piece.userId) {
      e.currentTarget.classList.add('selected');
      this.currentPiece = piece;
      this.currentPiece.id = id;
      const currentSquare = this.gameService.getCurrentSquare(this.usableSquares, piece);
      const takenSquares = this.gameService.getTakenSquares(this.currentPiece, this.pieces);
      const move1 = new Square(currentSquare.x + 1, currentSquare.y + 1, currentSquare.index + 9);
      const move2 = new Square(currentSquare.x + 1, currentSquare.y - 1, currentSquare.index + 7);
      const jumpMove1 = new Square(currentSquare.x + 2, currentSquare.y + 2, currentSquare.index + 18);
      const jumpMove2 = new Square(currentSquare.x + 2, currentSquare.y - 2, currentSquare.index + 14);
      const move3 = new Square(currentSquare.x - 1, currentSquare.y - 1, currentSquare.index - 9);
      const move4 = new Square(currentSquare.x - 1, currentSquare.y + 1, currentSquare.index - 7);
      const jumpMove3 = new Square(currentSquare.x - 2, currentSquare.y - 2, currentSquare.index - 18);
      const jumpMove4 = new Square(currentSquare.x - 2, currentSquare.y + 2, currentSquare.index - 14);

      this.choice1 = this.gameService.getRegularMove({
        board: this.usableSquares,
        move: move1,
        takenSquares: takenSquares,
      });
      this.choice2 = this.gameService.getRegularMove({
        board: this.usableSquares,
        takenSquares: takenSquares,
        move: move2
      });
      this.choice3 = this.gameService.getRegularMove({
        board: this.usableSquares,
        move: move3,
        takenSquares: takenSquares,
      });
      this.choice4 = this.gameService.getRegularMove({
        board: this.usableSquares,
        takenSquares: takenSquares,
        move: move4
      });
      this.jumpChoice1 = this.gameService.getJumpMove({
        board: this.usableSquares,
        takenSquares: takenSquares,
        move: move1,
        jumpMove: jumpMove1,
        player: this.playerColor
      });
      this.jumpChoice2 = this.gameService.getJumpMove({
        board: this.usableSquares,
        takenSquares: takenSquares,
        move: move2,
        jumpMove: jumpMove2,
        player: this.playerColor
      });
      this.jumpChoice3 = this.gameService.getJumpMove({
        board: this.usableSquares,
        takenSquares: takenSquares,
        move: move3,
        jumpMove: jumpMove3,
        player: this.playerColor
      });
      this.jumpChoice4 = this.gameService.getJumpMove({
        board: this.usableSquares,
        takenSquares: takenSquares,
        move: move4,
        jumpMove: jumpMove4,
        player: this.playerColor
      });
      this.choices.push(...[
        this.choice1,
        this.choice2,
        this.choice3,
        this.choice4,
        this.jumpChoice1,
        this.jumpChoice2,
        this.jumpChoice3,
        this.jumpChoice4
      ]);
    }
  }

  choosePiecePlayer1 = (e, piece, id) => {
    if (this.turn === piece.userId) {
      e.currentTarget.classList.add('selected');
      this.currentPiece = piece;
      const currentSquare = this.gameService.getCurrentSquare(this.usableSquares, piece);
      const takenSquares = this.gameService.getTakenSquares(this.currentPiece, this.pieces);
      const move1 = new Square(currentSquare.x + 1, currentSquare.y + 1, currentSquare.index + 9);
      const move2 = new Square(currentSquare.x + 1, currentSquare.y - 1, currentSquare.index + 7);
      const jumpMove1 = new Square(currentSquare.x + 2, currentSquare.y + 2, currentSquare.index + 18);
      const jumpMove2 = new Square(currentSquare.x + 2, currentSquare.y - 2, currentSquare.index + 14);
      this.choice1 = this.gameService.getRegularMove({
        board: this.usableSquares,
        move: move1,
        takenSquares: takenSquares,
      });
      this.choice2 = this.gameService.getRegularMove({
        board: this.usableSquares,
        takenSquares: takenSquares,
        move: move2
      });
      this.jumpChoice1 = this.gameService.getJumpMove({
        board: this.usableSquares,
        jumpMove: jumpMove1,
        move: move1,
        takenSquares: takenSquares,
        player: this.playerColor
      });
      this.jumpChoice2 = this.gameService.getJumpMove({
        board: this.usableSquares,
        jumpMove: jumpMove2,
        move: move2,
        takenSquares: takenSquares,
        player: this.playerColor
      });
      this.choices.push(...[this.choice1, this.choice2, this.jumpChoice1, this.jumpChoice2]);
    }
  }

  choosePiecePlayer2 = (e, piece, id) => {
    // same function as choosePiecePlayer1 except math for moves and jump criteria are different
    if (this.turn === piece.userId) {
      e.currentTarget.classList.add('selected');
      this.currentPiece = piece;
      const currentSquare = this.gameService.getCurrentSquare(this.usableSquares, piece);
      const takenSquares = this.gameService.getTakenSquares(this.currentPiece, this.pieces);
      const move1 = new Square(currentSquare.x - 1, currentSquare.y - 1, currentSquare.index - 9);
      const move2 = new Square(currentSquare.x - 1, currentSquare.y + 1, currentSquare.index - 7);
      const jumpMove1 = new Square(currentSquare.x - 2, currentSquare.y - 2, currentSquare.index - 18);
      const jumpMove2 = new Square(currentSquare.x - 2, currentSquare.y + 2, currentSquare.index - 14);

      this.choice1 = this.gameService.getRegularMove({
        board: this.usableSquares,
        move: move1,
        takenSquares: takenSquares,
      });
      this.choice2 = this.gameService.getRegularMove({
        board: this.usableSquares,
        takenSquares: takenSquares,
        move: move2
      });
      this.jumpChoice3 = this.gameService.getJumpMove({
        board: this.usableSquares,
        jumpMove: jumpMove1,
        move: move1,
        takenSquares: takenSquares,
        player: this.playerColor
      });
      this.jumpChoice4 = this.gameService.getJumpMove({
        board: this.usableSquares,
        jumpMove: jumpMove2,
        move: move2,
        takenSquares: takenSquares,
        player: this.playerColor
      });
      this.choices.push(...[this.choice1, this.choice2, this.jumpChoice3, this.jumpChoice4]);
    }
  }

  chooseSquare(square) {
    // if the square choosen matches any of the possible moves the player has
    if (this.choices.includes(square)) {
      const newTop = (square.x * 70) + 'px';
      const newLeft = (square.y * 70) + 'px';
      const url = `${this.gameId}/${this.currentPiece.id}`;
      this.gameService.update(url, {
        top: newTop,
        left: newLeft,
        y: square.x,
        x: square.y
      });

      // !!!!!!!!! Find new slide animation
      // $(`#${this.currentPiece.id}`).animate({
      //   top: newTop,
      //   left: newLeft
      // }, 'slide');

      this.gameService.getKingPiece({
        currentPiece: this.currentPiece,
        player: this.playerColor,
        number: 7,
        square: square,
        gameId: this.gameId
      });
      this.gameService.getKingPiece({
        currentPiece: this.currentPiece,
        player: this.playerColor,
        number: 0,
        square: square,
        gameId: this.gameId
      });

      if (square === this.jumpChoice1) {
        this.gameService.removePiece({
          pieces: this.pieces,
          squareX: this.jumpChoice1.x - 1,
          squareY: this.jumpChoice1.y - 1,
          currentPiece: this.currentPiece,
          gameId: this.gameId,
          player1: this.player1Death,
          player2: this.player2Death
        });
      } else if (square === this.jumpChoice2) {
        this.gameService.removePiece({
          pieces: this.pieces,
          squareX: this.jumpChoice2.x - 1,
          squareY: this.jumpChoice2.y + 1,
          currentPiece: this.currentPiece,
          gameId: this.gameId,
          player1: this.player1Death,
          player2: this.player2Death
        });
      } else if (square === this.jumpChoice3) {
        this.gameService.removePiece({
          pieces: this.pieces,
          squareX: this.jumpChoice3.x + 1,
          squareY: this.jumpChoice3.y + 1,
          currentPiece: this.currentPiece,
          gameId: this.gameId,
          player1: this.player1Death,
          player2: this.player2Death
        });
      } else if (square === this.jumpChoice4) {
        this.gameService.removePiece({
          pieces: this.pieces,
          squareX: this.jumpChoice4.x + 1,
          squareY: this.jumpChoice4.y - 1,
          currentPiece: this.currentPiece,
          gameId: this.gameId,
          player1: this.player1Death,
          player2: this.player2Death
        });
      }

      if (this.turn === this.player1Id) {
        this.gameService.update(`games/${this.gameId}/`, {
          turn: this.player2Id
        });
      } else if (this.turn === this.player2Id) {
        this.gameService.update(`games/${this.gameId}/`, {
          turn: this.player1Id
        });
      }
      this.removeSelected();
    }
  }

  reset() {
    // function to play again
    this.gameService.removePieces(`${this.gameId}/`);
    this.gameService.setPlayer1(this.gameId, this.player1Id);
    this.gameService.setPlayer2(this.gameId, this.player2Id);
    this.gameService.update(`games/${this.gameId}/`, {
      player1Death: 0,
      player2Death: 0
    });
    this.removeSelected();
  }

  leaveGame() {
    this.gameService.removePieces(`games/${this.gameId}`);
    this.gameService.removePieces(`${this.gameId}`);
    this.router.navigate([`dashboard/${this.userId}`]);
  }

  logOut() {
    this.authService.logout();
  }

  submitMessage() {
    this.gameService.sendMessage({
      gameId: this.gameId,
      userEmail: this.userEmail,
      userMessage: this.message
    });
    this.message = '';
  }

  ngOnDestroy(): void {
    this.gameSub.unsubscribe();
    this.messagesSub.unsubscribe();
    this.piecesSub.unsubscribe();
    this.localSub.unsubscribe();
  }

}

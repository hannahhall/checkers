import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameService, AuthService } from '../../providers/providers';
import { Piece, Move } from '../../models/models';
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
  messages = {};
  board = this.gameService.setSquares();
  usableSquares;
  heading = 'Checkers';
  currentPiece: Piece;
  choice1: Move;
  choice2: Move;
  choice3: Move;
  choice4: Move;
  jumpChoice1: Move;
  jumpChoice2: Move;
  jumpChoice3: Move;
  jumpChoice4: Move;
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
      console.log(params);
      this.gameId = params['value'].gid;
      console.log('gameId', this.gameId);
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


  toggleTurn(): boolean {
    // determines who's turn it is
    if (this.turn === this.userId) {
      // console.log('is this doing anything');
      return true;
    }
    return false;
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
      const move1 = new Move(currentSquare.x + 1, currentSquare.y + 1, currentSquare.index + 9);
      const move2 = new Move(currentSquare.x + 1, currentSquare.y - 1, currentSquare.index + 7);
      const jumpMove1 = new Move(currentSquare.x + 2, currentSquare.y + 2, currentSquare.index + 18);
      const jumpMove2 = new Move(currentSquare.x + 2, currentSquare.y - 2, currentSquare.index + 14);
      const move3 = new Move(currentSquare.x - 1, currentSquare.y - 1, currentSquare.index - 9);
      const move4 = new Move(currentSquare.x - 1, currentSquare.y + 1, currentSquare.index - 7);
      const jumpMove3 = new Move(currentSquare.x - 2, currentSquare.y - 2, currentSquare.index - 18);
      const jumpMove4 = new Move(currentSquare.x - 2, currentSquare.y + 2, currentSquare.index - 14);
      // const move1 = new player1Moves.Move1(currentSquare.x, currentSquare.y, currentSquare.index);
      // const move2 = new player1Moves.Move2(currentSquare.x, currentSquare.y, currentSquare.index);
      // const move3 = new player2Moves.Move1(currentSquare.x, currentSquare.y, currentSquare.index);
      // const move4 = new player2Moves.Move2(currentSquare.x, currentSquare.y, currentSquare.index);
      // const jumpMove1 = new player1Moves.JumpMove1(currentSquare.x, currentSquare.y, currentSquare.index);
      // const jumpMove2 = new player1Moves.JumpMove2(currentSquare.x, currentSquare.y, currentSquare.index);
      // const jumpMove3 = new player2Moves.JumpMove1(currentSquare.x, currentSquare.y, currentSquare.index);
      // const jumpMove4 = new player2Moves.JumpMove2(currentSquare.x, currentSquare.y, currentSquare.index);

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
      this.jumpChoice1 = this.gameService.getKingJumpMove({
        board: this.usableSquares,
        takenSquares: takenSquares,
        move: move1,
        jumpMove: jumpMove1,
        player: this.playerColor
      });
      this.jumpChoice2 = this.gameService.getKingJumpMove({
        board: this.usableSquares,
        takenSquares: takenSquares,
        move: move2,
        jumpMove: jumpMove2,
        player: this.playerColor
      });
      this.jumpChoice3 = this.gameService.getKingJumpMove({
        board: this.usableSquares,
        takenSquares: takenSquares,
        move: move3,
        jumpMove: jumpMove3,
        player: this.playerColor
      });
      this.jumpChoice4 = this.gameService.getKingJumpMove({
        board: this.usableSquares,
        takenSquares: takenSquares,
        move: move4,
        jumpMove: jumpMove4,
        player: this.playerColor
      });
    }
  }

  choosePiecePlayer1 = (e, piece, id) => {
    console.log('click', e);
    // when player 1 chooses a piece this function is called
    if (this.turn === piece.userId) {
      e.currentTarget.classList.add('selected');
      this.currentPiece = piece;
      const currentSquare = this.gameService.getCurrentSquare(this.usableSquares, piece);
      const takenSquares = this.gameService.getTakenSquares(this.currentPiece, this.pieces);
      const move1 = new Move(currentSquare.x + 1, currentSquare.y + 1, currentSquare.index + 9);
      const move2 = new Move(currentSquare.x + 1, currentSquare.y - 1, currentSquare.index + 7);
      const jumpMove1 = new Move(currentSquare.x + 2, currentSquare.y + 2, currentSquare.index + 18);
      const jumpMove2 = new Move(currentSquare.x + 2, currentSquare.y - 2, currentSquare.index + 14);
      // move1 = new player1Moves.Move1(currentSquare.x, currentSquare.y, currentSquare.index),
      // move2 = new player1Moves.Move2(currentSquare.x, currentSquare.y, currentSquare.index),
      // jumpMove1 = new player1Moves.JumpMove1(currentSquare.x, currentSquare.y, currentSquare.index),
      // jumpMove2 = new player1Moves.JumpMove2(currentSquare.x, currentSquare.y, currentSquare.index);

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
        oppositePlayer: 'white'
      });
      this.jumpChoice2 = this.gameService.getJumpMove({
        board: this.usableSquares,
        jumpMove: jumpMove2,
        move: move2,
        takenSquares: takenSquares,
        oppositePlayer: 'white'
      });
    }
  }

  choosePiecePlayer2 = (e, piece, id) => {
    // same function as choosePiecePlayer1 except math for moves and jump criteria are different
    if (this.turn === piece.userId) {
      e.currentTarget.classList.add('selected');
      this.currentPiece = piece;
      const currentSquare = this.gameService.getCurrentSquare(this.usableSquares, piece);
      const takenSquares = this.gameService.getTakenSquares(this.currentPiece, this.pieces);
      const move1 = new Move(currentSquare.x - 1, currentSquare.y - 1, currentSquare.index - 9);
      const move2 = new Move(currentSquare.x - 1, currentSquare.y + 1, currentSquare.index - 7);
      const jumpMove1 = new Move(currentSquare.x - 2, currentSquare.y - 2, currentSquare.index - 18);
      const jumpMove2 = new Move(currentSquare.x - 2, currentSquare.y + 2, currentSquare.index - 14);

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
        oppositePlayer: 'red'
      });
      this.jumpChoice4 = this.gameService.getJumpMove({
        board: this.usableSquares,
        jumpMove: jumpMove2,
        move: move2,
        takenSquares: takenSquares,
        oppositePlayer: 'red'
      });
    }
  }

  chooseSquare(square) {
    // if the square choosen matches any of the possible moves the player has
    if (square === this.choice1 ||
      square === this.choice2 ||
      square === this.choice3 ||
      square === this.choice4 ||
      square === this.jumpChoice1 ||
      square === this.jumpChoice2 ||
      square === this.jumpChoice3 ||
      square === this.jumpChoice4) {
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

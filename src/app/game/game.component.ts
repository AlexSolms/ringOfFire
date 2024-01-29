import { Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { GameInfoComponent } from '../game-info/game-info.component';
import { Firestore, collection, doc, onSnapshot, addDoc, updateDoc, docData } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    PlayerComponent,
    DialogAddPlayerComponent,
    MatIconModule,
    MatButtonModule,
    GameInfoComponent
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})


export class GameComponent {

  pickCardAnimation = false;
  game!: Game;
  currentCard: string | undefined = '';

  unsubList: any;

  route: ActivatedRoute = inject(ActivatedRoute);
  firestore: Firestore = inject(Firestore);

  gameId: string = '';

  constructor(public dialog: MatDialog) {
    this.openGame();
    this.subscribeNewGame(0);
    this.route.params.subscribe((params) => {
      params['id'];
      this.gameId = params['id'];
      let docRef = doc(this.firestore, 'games', this.gameId);
      docData(docRef).subscribe(game => {
        if (game) {
          console.log('Was kommt hier raus? ',game);
          
           this.game.gameId = game['gameId'];
           this.game.playedCards = game['playedCards'];
           this.game.players = game['players'];
           this.game.currentPlayer = game['currentPlayer'];
           this.game.stack = game['stack'];
           this.game.playedCards = game['playedCards'];
           console.log('Was kommt hier raus? ',this.game);
        }
      }
      )
    });


  }

  openGame() {
    this.game = new Game();
    console.log('ISt es das Game:', this.game)
    //this.addThings(this.game.toJson());
  }

  async updateGame(docId: string, colId: string = 'games', item: {}) { // ist das Array was ich ändern will. zum Beispiel die Player oder den Stapel zu ziehender Karten
    console.log('gameId update: ', this.gameId);
    await updateDoc(this.getSingleGamesRef(colId, docId), item).catch(
      (err) => { console.log(err); }
    );
  }

  async addThings(item: {}) { // ist das Array was ich adden will. zum Beispiel die Player oder den Stapel zu ziehender Karten
    let gameInfo = await addDoc(this.getGamesRef(), item);
    this.gameId = gameInfo.id; // returns the game id of added game
    console.log('gameId aktuell: ', this.gameId);
  }

  subscribeNewGame(i: number) {
    this.unsubList = onSnapshot(this.getGamesRef(), (list) => {
      list.forEach(element => {
        console.log(`Game update_${i}: `, element.data());
        console.log(`Game id_${i}: `, element.id);
        i++;
      });
    });
  }



  ngOnDestroy() {
    this.unsubList();
  }

  getGamesRef() {
    return collection(this.firestore, 'games');
  }

  getSingleGamesRef(colId: string = 'games', docId: string) { //colId: string = 'games' //docId == hier brauche ich die ID vom Element, dass ich ändern will
    return doc(collection(this.firestore, colId), docId);
  }



  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
    dialogRef.afterClosed().subscribe((name: string) => {
      if (name) this.game.players.push(name); /* name.length > 0 */
      console.log('myGame:', this.game);
      console.log('gameID: ', this.gameId);
      this.updateGame(this.gameId, 'games', this.game.toJson());
    });
  }



  /**
   * this function pops and pushes cards from one array to another and set the playCardAnimationflag
   * DRAWNCARD is needed because Typescript need the check if it is undefiend
   */
  takeCard() {
    if (this.game.players.length) { // hier muss noch ein Popup rein, das anzeigt, dass erst einmal ein Spieler vorhanden sein muss
      if (!this.pickCardAnimation) {
        const DRAWNCARD: string | undefined = this.currentCard = this.game.stack.pop();
        if (DRAWNCARD !== undefined) {
          this.pickCardAnimation = true;
          // this.updateGame(this.gameId, 'games' ,this.game.toJson());
          setTimeout(() => this.game.playedCards.push(DRAWNCARD), 1000);
        }
        this.game.currentPlayer = (this.game.currentPlayer + 1) % this.game.players.length;
        setTimeout(() => this.pickCardAnimation = false, 1500);
      }
    }
  }






}

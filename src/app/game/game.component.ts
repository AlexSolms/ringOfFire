import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { GameInfoComponent } from '../game-info/game-info.component';
// import { AngularFirestoreModule } from '@angular/fire/compat/firestore/'; 
import { query, orderBy, limit, Firestore, collection, doc, collectionData, onSnapshot, addDoc, updateDoc, deleteDoc, where } from '@angular/fire/firestore';
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
  
  firestore: Firestore = inject(Firestore);

  test:{}={
    test: "mytest"
  };

  constructor(public dialog: MatDialog) {
    this.newGame();
    this.subscribeNewGame();
    /* this.unsubList = onSnapshot(this.getGamesRef(), (list) => {
      list.forEach(element => {
        console.log('Game update1: ', element.data());
        console.log('Game update1: ', element.id);
      });
    }); */
    
  }

  newGame() {
    this.game = new Game(); 
     this.addThings(this.test)
  }

  async addThings(item: {}){
    await addDoc(this.getGamesRef(), item);
  }

  subscribeNewGame() {
    this.unsubList = onSnapshot(this.getGamesRef(), (list) => {
      list.forEach(element => {
        console.log('Game update1: ', element.data());
        console.log('Game update1: ', element.id);
      });
    });
  }



  ngOnDestroy() {
    this.unsubList();
  }

  getGamesRef() {
    return collection(this.firestore, 'games');
  }



  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
    dialogRef.afterClosed().subscribe((name: string) => {
      if (name) this.game.players.push(name); /* name.length > 0 */
      console.log('myGame:', this.game);
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
          setTimeout(() => this.game.playedCards.push(DRAWNCARD), 1000);
        }
        this.game.currentPlayer = (this.game.currentPlayer + 1) % this.game.players.length;
        setTimeout(() => this.pickCardAnimation = false, 1500);
      }
    }
  }






}

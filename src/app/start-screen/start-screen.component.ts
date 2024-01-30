import { CommonModule } from '@angular/common';
import { Component,inject } from '@angular/core';
import { Router } from '@angular/router';
import { Game } from '../../models/game';
import {Firestore, collection, addDoc, updateDoc, doc} from '@angular/fire/firestore';


@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent {
  game!: Game;
  firestore: Firestore = inject(Firestore);
  gameId: string = "";

  constructor(private router: Router) {
  }

  async newGame(){
    this.game = new Game();
    await addDoc(this.getGamesRef(), this.game.toJson()).then(async (gameInfo) =>{
      this.game.gameId = gameInfo.id;
      let item: {} = this.game.toJson();
      await updateDoc(this.getSingleGamesRef('games', this.game.gameId), item).catch(
        (err) => { console.log(err); }
      ); 

    this.router.navigateByUrl('/game/' + gameInfo.id)
  });
   // this.router.navigateByUrl('/game/' + this.gameId);
  }

  getGamesRef() {
    return collection(this.firestore, 'games');
  }
  getSingleGamesRef(colId: string = 'games', docId: string) { 
    return doc(collection(this.firestore, colId), docId);
  }
}



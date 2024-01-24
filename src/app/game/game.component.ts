import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PlayerComponent, DialogAddPlayerComponent, MatIconModule, MatButtonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})


export class GameComponent {

  pickCardAnimation = false;
  game: Game;
  currentCard: string | undefined = '';

  constructor(public dialog: MatDialog) {
    this.game = new Game();
    console.log(this.game.stack);

  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      console.log('The dialog was closed', name);
      this.game.players.push(name);
      
    });
  }

/**
 * this function pops and pushes cards from one array to another and set the playCardAnimationflag
 * DRAWNCARD is needed because Typescript need the check if it is undefiend
 */
  takeCard() {
    // Prüfen, ob der Stack nicht leer ist, bevor Sie eine Karte nehmen
    if (!this.pickCardAnimation) {
      const DRAWNCARD: string | undefined = this.currentCard = this.game.stack.pop();
      if (DRAWNCARD !== undefined) {
        this.pickCardAnimation = true;
        setTimeout(() => this.game.playedCards.push(DRAWNCARD), 1000);
      }
      setTimeout(() => this.pickCardAnimation = false, 1500);
    }
  }

}

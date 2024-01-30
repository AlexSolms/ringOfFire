
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StartScreenComponent } from './start-screen/start-screen.component';
import { GameComponent } from './game/game.component';
// import { DialogAddPlayerComponent } from './dialog-add-player/dialog-add-player.component';

export const routes: Routes = [
    {path: '', component: StartScreenComponent},
    {path: 'game/:id', component: GameComponent},
    // {path: 'dialog', component: DialogAddPlayerComponent},
];

 @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class APPRoutingModule {} 
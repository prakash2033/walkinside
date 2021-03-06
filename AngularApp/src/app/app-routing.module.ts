import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ScrumComponent } from './scrum/scrum.component';
import { PokerComponent } from './poker/poker.component';

const routes: Routes = [
  {path:'', component: HomeComponent},
  {path:'home', component: HomeComponent},
  {path:'scrum', component: ScrumComponent},
  {path:'poker', component: PokerComponent},
  {path:'scrum/:scrumTeam', component: ScrumComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

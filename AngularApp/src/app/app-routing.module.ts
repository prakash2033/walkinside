import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ScrumComponent } from './scrum/scrum.component';

const routes: Routes = [
  {path:'home/:scrumTeam', component: HomeComponent},
  {path:'scrum/:scrumTeam', component: ScrumComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

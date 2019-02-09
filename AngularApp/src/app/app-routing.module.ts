import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ScrumComponent } from './scrum/scrum.component';

const routes: Routes = [
  {path:'home', component: HomeComponent},
  {path:'scrum/:avatar/:avatarSrc', component: ScrumComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

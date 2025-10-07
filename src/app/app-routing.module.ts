import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './layout/home/home.component';
import { ListEventComponent } from './layout/list-event/list-event.component';
import { NotFoundComponent } from './layout/not-found/not-found.component';

const routes: Routes = [

 { path: 'home', component: HomeComponent },
  {
    path: 'list',
    component: ListEventComponent,
    
  },
  { path: '**', component: NotFoundComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

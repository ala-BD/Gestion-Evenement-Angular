import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventsComponent } from './events.component';
import { AddEventComponent } from './components/add-event/add-event.component';

const routes: Routes = [
  { path: '', component: EventsComponent },
  { path: 'add', component: AddEventComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }

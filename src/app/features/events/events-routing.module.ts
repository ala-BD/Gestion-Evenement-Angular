import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventsComponent } from './events.component';
import { AddEventComponent } from './components/add-event/add-event.component';
import { ParticipationFormComponent } from './components/participation-form/participation-form.component';
import { MyEventsComponent } from './components/my-events/my-events.component';
import { MyParticipationsComponent } from './components/my-participations/my-participations.component';

const routes: Routes = [
  { path: '', component: EventsComponent },
  { path: 'add', component: AddEventComponent },
  { path: 'participate/:id', component: ParticipationFormComponent },
  { path: 'my-events', component: MyEventsComponent },
  { path: 'my-participations', component: MyParticipationsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }

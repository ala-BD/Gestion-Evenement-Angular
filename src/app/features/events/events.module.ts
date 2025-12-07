import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { EventsRoutingModule } from './events-routing.module';
import { EventsComponent } from './events.component';
import { AddEventComponent } from './components/add-event/add-event.component';
import { ParticipationFormComponent } from './components/participation-form/participation-form.component';
import { MyEventsComponent } from './components/my-events/my-events.component';
import { MyParticipationsComponent } from './components/my-participations/my-participations.component';


@NgModule({
  declarations: [
    EventsComponent,
    AddEventComponent,
    ParticipationFormComponent,
    MyEventsComponent,
    MyParticipationsComponent
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class EventsModule { }

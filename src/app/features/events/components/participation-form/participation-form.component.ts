import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Participation } from '../../../../models/participation';
import { ParticipationService } from '../../services/participation.service';
import { EventService } from '../../services/event.service';
import { Event } from '../../../../models/event';

@Component({
  selector: 'app-participation-form',
  templateUrl: './participation-form.component.html',
  styleUrls: ['./participation-form.component.css']
})
export class ParticipationFormComponent {
  event?: Event;
  model: Partial<Participation> = {
    userId: 1,
    nbPlaces: 1,
    status: 'pending'
  };
  submitted = false;
  errorMsg = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly participationService: ParticipationService,
    private readonly eventService: EventService,
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.event = this.eventService.getEventsValue().find(e => e.id === id);
    if (this.event) {
      this.model.eventId = this.event.id;
    }
  }

  onSubmit(form: NgForm) {
    this.submitted = true;
    this.errorMsg = '';
    if (form.invalid || !this.model.eventId || !this.model.userId) {
      return;
    }

    const res = this.participationService.addParticipation({
      userId: this.model.userId!,
      eventId: this.model.eventId!,
      emailParticipant: this.model.emailParticipant!,
      nbPlaces: this.model.nbPlaces!,
      status: this.model.status as any
    });

    if (!res.ok) {
      this.errorMsg = res.message || 'Erreur lors de l\'inscription';
      return;
    }

    // Success -> back to list
    this.router.navigate(['/list']);
  }
}

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
    // Utiliser getEventById() avec HttpClient
    this.eventService.getEventById(id).subscribe({
      next: (event) => {
        this.event = event;
        this.model.eventId = event.id;
      },
      error: (error) => {
        console.log('Erreur lors de la récupération de l\'événement:', error);
        this.errorMsg = 'Événement introuvable';
      }
    });
  }

  onSubmit(form: NgForm) {
    this.submitted = true;
    this.errorMsg = '';
    if (form.invalid || !this.model.eventId || !this.model.userId) {
      return;
    }

    this.participationService.addParticipation({
      userId: this.model.userId!,
      eventId: this.model.eventId!,
      emailParticipant: this.model.emailParticipant!,
      nbPlaces: this.model.nbPlaces!,
      status: this.model.status as any
    }).subscribe({
      next: (res) => {
        if (!res.ok) {
          this.errorMsg = res.message || 'Erreur lors de l\'inscription';
          return;
        }
        // Success -> back to list
        this.router.navigate(['/list']);
      },
      error: (error) => {
        console.error('Erreur lors de l\'inscription:', error);
        this.errorMsg = 'Erreur lors de l\'inscription. Veuillez réessayer.';
      }
    });
  }
}

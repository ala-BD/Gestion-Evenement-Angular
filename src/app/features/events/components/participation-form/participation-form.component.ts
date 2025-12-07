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
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.errorMsg = 'ID d\'événement manquant';
      return;
    }
    // Utiliser getEventById() avec HttpClient (accepte nombre ou chaîne)
    this.eventService.getEventById(idParam).subscribe({
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
    if (form.invalid || !this.model.eventId || !this.model.userId || !this.event) {
      return;
    }

    // Vérifier les places disponibles
    if (this.event.nbreplaces < (this.model.nbPlaces || 1)) {
      this.errorMsg = 'Nombre de places insuffisant';
      return;
    }

    // Workshop: Utiliser addParticipationToBackend() pour ajouter la participation dans le backend
    this.participationService.addParticipationToBackend({
      userId: this.model.userId!,
      eventId: this.model.eventId!,
      emailParticipant: this.model.emailParticipant!,
      nbPlaces: this.model.nbPlaces!,
      status: this.model.status as any
    }).subscribe({
      next: (participation) => {
        console.log('Participation créée avec succès:', participation);
        
        // Mettre à jour le nombre de places de l'événement
        this.event!.nbreplaces -= participation.nbPlaces;
        this.eventService.updateEvent(this.event!).subscribe({
          next: () => {
            // Success -> rediriger vers mes participations
            this.router.navigate(['/events/my-participations']);
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour de l\'événement:', error);
            // La participation a été créée, mais la mise à jour de l'événement a échoué
            // Rediriger quand même vers mes participations
            this.router.navigate(['/events/my-participations']);
          }
        });
      },
      error: (error) => {
        console.error('Erreur lors de l\'inscription:', error);
        this.errorMsg = 'Erreur lors de l\'inscription. Veuillez réessayer.';
        // Workshop: Gestion d'erreur avec alert
        alert('Erreur lors de l\'inscription. Veuillez réessayer.');
      }
    });
  }
}

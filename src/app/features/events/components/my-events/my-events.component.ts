import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Event } from '../../../../models/event';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrl: './my-events.component.css'
})
export class MyEventsComponent implements OnInit, OnDestroy {
  events: Event[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  private eventsSubscription?: Subscription;
  private readonly ORGANIZER_ID = 1; // Workshop: organizerId = 1

  constructor(
    private readonly eventService: EventService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadMyEvents();
  }

  ngOnDestroy(): void {
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }
  }

  loadMyEvents(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.eventsSubscription = this.eventService.getEventsByOrganizerId(this.ORGANIZER_ID).subscribe({
      next: (response) => {
        this.events = response || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération de mes événements:', error);
        this.errorMessage = 'Impossible de charger vos événements. Vérifiez que le backend est démarré sur http://localhost:3000';
        this.events = [];
        this.isLoading = false;
      }
    });
  }

  // Workshop: Modifier un événement
  modifyEvent(event: Event): void {
    console.log('Modifier événement:', event);
    console.log('ID de l\'événement:', event.id, 'Type:', typeof event.id);
    // Rediriger vers le formulaire d'ajout avec l'ID de l'événement en paramètre
    this.router.navigate(['/events/add'], { queryParams: { id: event.id } });
  }

  // Workshop: Supprimer un événement
  deleteEvent(event: Event): void {
    console.log('Supprimer événement:', event);
    console.log('ID de l\'événement:', event.id, 'Type:', typeof event.id);
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'événement "${event.titre}" ?`)) {
      this.eventService.deleteEvent(event.id).subscribe({
        next: () => {
          console.log('Événement supprimé avec succès');
          // Workshop: Gestion d'erreur avec alert
          alert('Événement supprimé avec succès !');
          // Recharger la liste des événements
          this.loadMyEvents();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          // Workshop: Gestion d'erreur avec alert et redirection possible
          const errorMessage = typeof error === 'string' ? error : 'Erreur lors de la suppression de l\'événement. Veuillez réessayer.';
          alert(errorMessage);
          // Si erreur serveur (500), on pourrait rediriger vers une page d'erreur
          // Pour l'instant, on reste sur la page et on affiche l'alerte
        }
      });
    }
  }

  // Vérifie si l'événement est expiré
  isExpired(event: Event): boolean {
    const today = new Date();
    return event.date.getTime() < today.getTime();
  }
}

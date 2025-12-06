import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Event } from '../../models/event';
import { EventService } from '../../features/events/services/event.service';

@Component({
  selector: 'app-list-event',
  templateUrl: './list-event.component.html',
  styleUrls: ['./list-event.component.css']
})
export class ListEventComponent implements OnInit, OnDestroy {
  searchText: string = '';
  EVENTS: Event[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  private eventsSubscription?: Subscription;

  constructor(private readonly eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    // Exercice 1 - A: Récupération des données avec GET
    this.eventsSubscription = this.eventService.getAllEventsFromBackend().subscribe({
      next: (response) => {
        this.EVENTS = response || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des événements:', error);
        this.errorMessage = 'Impossible de charger les événements. Vérifiez que le backend est démarré sur http://localhost:3000';
        this.EVENTS = [];
        this.isLoading = false;
      }
    });

 
  }

  ngOnDestroy(): void {
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }
  }

  // Incrémente les likes (si pas expiré)
  incLikes(event: Event) {
    if (!this.isExpired(event)) {
      event.nbrLikes = (event.nbrLikes || 0) + 1;
      this.eventService.updateEvent(event).subscribe({
        next: (updatedEvent) => {
          // Mettre à jour l'événement dans la liste
          const index = this.EVENTS.findIndex(e => e.id === updatedEvent.id);
          if (index !== -1) {
            this.EVENTS[index] = updatedEvent;
          }
        },
        error: (error) => {
          console.log('Erreur lors de la mise à jour:', error);
        }
      });
    }
  }

  // Diminue le nombre de places (si disponible et pas expiré)
  buy(event: Event) {
    if (!this.isExpired(event) && event.nbreplaces > 0) {
      event.nbreplaces--;
      this.eventService.updateEvent(event).subscribe({
        next: (updatedEvent) => {
          // Mettre à jour l'événement dans la liste
          const index = this.EVENTS.findIndex(e => e.id === updatedEvent.id);
          if (index !== -1) {
            this.EVENTS[index] = updatedEvent;
          }
        },
        error: (error) => {
          console.log('Erreur lors de la mise à jour:', error);
        }
      });
    }
  }

  // Vérifie si l'événement est expiré
  isExpired(event: Event): boolean {
    const today = new Date();
    return event.date.getTime() < today.getTime();
  }

  // Getter qui retourne la liste filtrée (titre ou lieu)
  get filteredEvents(): Event[] {
    const search = (this.searchText || '').trim().toLowerCase();
    if (!search) return this.EVENTS;

    return this.EVENTS.filter(ev =>
      (ev.titre || '').toLowerCase().includes(search) ||
      (ev.Lieu || '').toLowerCase().includes(search)
    );
  }

  // Vérifie s'il y a une recherche active
  get hasSearch(): boolean {
    return (this.searchText || '').trim().length > 0;
  }
}
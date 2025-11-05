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
  private eventsSubscription?: Subscription;

  constructor(private readonly eventService: EventService) {}

  ngOnInit(): void {
    // Charger les événements initiaux
    this.EVENTS = this.eventService.getEventsValue();
    
    // S'abonner aux mises à jour
    this.eventsSubscription = this.eventService.getEvents().subscribe(events => {
      this.EVENTS = events;
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
      this.eventService.updateEvent(event);
    }
  }

  // Diminue le nombre de places (si disponible et pas expiré)
  buy(event: Event) {
    if (!this.isExpired(event) && event.nbreplaces > 0) {
      event.nbreplaces--;
      this.eventService.updateEvent(event);
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
}
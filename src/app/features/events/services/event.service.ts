import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Event } from '../../../models/event';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private readonly STORAGE_KEY = 'events-store';

  private eventsSubject = new BehaviorSubject<Event[]>([
    {
      id: 1,
      titre: "Concert Jazz",
      description: "Un concert exceptionnel avec des artistes internationaux.",
      date: new Date("2023-10-15T20:00:00"),
      Lieu: "Théâtre Municipal",
      prix: 50,
      origanisateurId: 101,
      imageUrl: "images/event.png",
      nbreplaces: 5,
      nbrLikes: 35
    },
    {
      id: 2,
      titre: "Conférence Tech IA",
      description: "Discussion autour des dernières tendances en intelligence artificielle.",
      date: new Date("2025-11-02T09:00:00"),
      Lieu: "Centre de Congrès",
      prix: 0,
      origanisateurId: 102,
      imageUrl: "images/event.png",
      nbreplaces: 10,
      nbrLikes: 120
    },
    {
      id: 3,
      titre: "Atelier Cuisine",
      description: "Apprenez à préparer des plats traditionnels tunisiens.",
      date: new Date("2025-12-05T14:30:00"),
      Lieu: "Espace Culturel",
      prix: 25,
      origanisateurId: 103,
      imageUrl: "images/event.png",
      nbreplaces: 30,
      nbrLikes: 48
    },
    {
      id: 4,
      titre: "Marathon Carthage",
      description: "Une course sportive à travers les sites historiques.",
      date: new Date("2026-01-20T07:00:00"),
      Lieu: "Carthage",
      prix: 10,
      origanisateurId: 104,
      imageUrl: "images/event.png",
      nbreplaces: 1000,
      nbrLikes: 300
    }
  ]);

  private nextId = 5;

  constructor() {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (raw) {
      try {
        const parsed: Event[] = JSON.parse(raw).map((e: any) => ({
          ...e,
          date: new Date(e.date)
        }));
        this.eventsSubject.next(parsed);
        this.nextId = Math.max(0, ...parsed.map(e => e.id)) + 1;
      } catch {
        // ignore storage parse errors
      }
    } else {
      this.persist();
    }
  }

  getEvents(): Observable<Event[]> {
    return this.eventsSubject.asObservable();
  }

  getEventsValue(): Event[] {
    return this.eventsSubject.value;
  }

  addEvent(event: Partial<Event>): void {
    const currentEvents = this.eventsSubject.value;
    const newEvent: Event = {
      id: this.nextId++,
      titre: event.titre || '',
      description: event.description || '',
      date: event.date ? new Date(event.date) : new Date(),
      Lieu: event.Lieu || '',
      prix: event.prix ?? 0,
      origanisateurId: event.origanisateurId ?? 1,
      imageUrl: event.imageUrl || 'images/event.png',
      nbreplaces: event.nbreplaces ?? 0,
      nbrLikes: event.nbrLikes ?? 0,
      domains: event.domains || []
    };
    this.eventsSubject.next([...currentEvents, newEvent]);
    this.persist();
  }

  updateEvent(event: Event): void {
    const currentEvents = this.eventsSubject.value;
    const index = currentEvents.findIndex(e => e.id === event.id);
    if (index !== -1) {
      const updatedEvents = [...currentEvents];
      updatedEvents[index] = event;
      this.eventsSubject.next(updatedEvents);
      this.persist();
    }
  }

  private persist(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.eventsSubject.value));
    } catch {
      // storage might be unavailable
    }
  }
}


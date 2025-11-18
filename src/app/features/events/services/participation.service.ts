import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Participation } from '../../../models/participation';
import { EventService } from './event.service';

@Injectable({ providedIn: 'root' })
export class ParticipationService {
  private readonly STORAGE_KEY = 'participations-store';
  private participationsSubject = new BehaviorSubject<Participation[]>([]);
  private nextId = 1;

  constructor(private readonly eventService: EventService) {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (raw) {
      try {
        const parsed: Participation[] = JSON.parse(raw).map((p: any) => ({
          ...p,
          registrationDate: new Date(p.registrationDate)
        }));
        this.participationsSubject.next(parsed);
        this.nextId = Math.max(0, ...parsed.map(p => p.id || 0)) + 1;
      } catch {
        // ignore
      }
    }
  }

  getParticipations() {
    return this.participationsSubject.asObservable();
  }

  getByEventId(eventId: number): Participation[] {
    return this.participationsSubject.value.filter(p => p.eventId === eventId);
  }

  addParticipation(p: Omit<Participation, 'id' | 'registrationDate'>): { ok: boolean; message?: string } {
    const events = this.eventService.getEventsValue();
    const ev = events.find(e => e.id === p.eventId);
    if (!ev) return { ok: false, message: 'Événement introuvable' };

    if (ev.nbreplaces < p.nbPlaces) {
      return { ok: false, message: 'Nombre de places insuffisant' };
    }

    // Update seats
    ev.nbreplaces -= p.nbPlaces;
    this.eventService.updateEvent(ev);

    const newP: Participation = {
      ...p,
      id: this.nextId++,
      registrationDate: new Date()
    };
    this.participationsSubject.next([...this.participationsSubject.value, newP]);
    this.persist();
    return { ok: true };
  }

  private persist() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.participationsSubject.value));
    } catch {}
  }
}

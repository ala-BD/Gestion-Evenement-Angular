import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Participation } from '../../../models/participation';
import { EventService } from './event.service';

@Injectable({ providedIn: 'root' })
export class ParticipationService {
  constructor(private readonly eventService: EventService) {}

  getParticipations(): Observable<Participation[]> {
    // Pour l'instant, retourner un tableau vide
    // Si vous avez un backend pour les participations, utilisez HttpClient ici
    return of([]);
  }

  getByEventId(eventId: number): Observable<Participation[]> {
    return this.getParticipations().pipe(
      map(participations => participations.filter(p => p.eventId === eventId))
    );
  }

  addParticipation(p: Omit<Participation, 'id' | 'registrationDate'>): Observable<{ ok: boolean; message?: string }> {
    // Récupérer l'événement depuis le backend
    return this.eventService.getEventById(p.eventId).pipe(
      switchMap(ev => {
        // Vérifier si l'événement existe
        if (!ev) {
          return of({ ok: false, message: 'Événement introuvable' });
        }

        // Vérifier les places disponibles
        if (ev.nbreplaces < p.nbPlaces) {
          return of({ ok: false, message: 'Nombre de places insuffisant' });
        }

        // Mettre à jour le nombre de places
        ev.nbreplaces -= p.nbPlaces;
        
        // Mettre à jour l'événement via le backend
        return this.eventService.updateEvent(ev).pipe(
          map(() => ({ ok: true })),
          catchError(error => {
            console.error('Erreur lors de la mise à jour de l\'événement:', error);
            return of({ ok: false, message: 'Erreur lors de la mise à jour de l\'événement' });
          })
        );
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération de l\'événement:', error);
        return of({ ok: false, message: 'Erreur lors de la récupération de l\'événement' });
      })
    );
  }
}

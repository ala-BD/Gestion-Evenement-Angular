import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Participation } from '../../../models/participation';
import { EventService } from './event.service';
import { ErrorService } from '../../shared/services/error.service';

@Injectable({ providedIn: 'root' })
export class ParticipationService {
  private apiParticipationsUrl = 'http://localhost:3000/participations';

  constructor(
    private readonly eventService: EventService,
    private readonly http: HttpClient,
    private readonly errorService: ErrorService
  ) {}

  getParticipations(): Observable<Participation[]> {
    return this.http.get<Participation[]>(this.apiParticipationsUrl).pipe(
      map((participations: any[]) => {
        if (!participations || !Array.isArray(participations)) {
          return [];
        }
        return participations.map(p => ({
          ...p,
          registrationDate: p.registrationDate ? new Date(p.registrationDate) : new Date()
        }));
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur dans getParticipations:', error);
        return this.errorService.handleError(error);
      })
    );
  }

  // Workshop: Récupérer les participations par userId
  getParticipationsByUserId(userId: number): Observable<Participation[]> {
    return this.http.get<Participation[]>(`${this.apiParticipationsUrl}?userId=${userId}`).pipe(
      map((participations: any[]) => {
        if (!participations || !Array.isArray(participations)) {
          return [];
        }
        return participations.map(p => ({
          ...p,
          registrationDate: p.registrationDate ? new Date(p.registrationDate) : new Date()
        }));
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur dans getParticipationsByUserId:', error);
        return this.errorService.handleError(error);
      })
    );
  }

  // Workshop: Ajouter une participation dans le backend
  addParticipationToBackend(participation: Omit<Participation, 'id' | 'registrationDate'>): Observable<Participation> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const participationToSend = {
      ...participation,
      registrationDate: new Date().toISOString()
    };

    return this.http.post<Participation>(this.apiParticipationsUrl, participationToSend, { headers }).pipe(
      map((newParticipation: any) => ({
        ...newParticipation,
        registrationDate: newParticipation.registrationDate ? new Date(newParticipation.registrationDate) : new Date()
      })),
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur lors de la création de la participation:', error);
        return this.errorService.handleError(error);
      })
    );
  }

  // Workshop: Supprimer une participation (accepte nombre ou chaîne)
  deleteParticipation(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiParticipationsUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur lors de la suppression de la participation:', error);
        return this.errorService.handleError(error);
      })
    );
  }

  getByEventId(eventId: number | string): Observable<Participation[]> {
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

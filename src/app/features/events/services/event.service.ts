import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Event } from '../../../models/event';
import { ErrorService } from '../../shared/services/error.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiEventsUrl = 'http://localhost:3000/events';

  constructor(
    private _http: HttpClient,
    private errorService: ErrorService
  ) {}

  // Exercice 1 - A: Récupération des données avec GET
  getAllEventsFromBackend(): Observable<Event[]> {
    return this._http.get<Event[]>(this.apiEventsUrl).pipe(
      map((events: any[]) => {
        if (!events || !Array.isArray(events)) {
          return [];
        }
        return events.map(e => ({
          ...e,
          date: e.date ? new Date(e.date) : new Date()
        }));
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur dans getAllEventsFromBackend:', error);
        return this.errorService.handleError(error);
      })
    );
  }

  // Exercice 1 - B: GET avec params et headers
  getAllEventsWithParams(): Observable<Event[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer 123',
      'Content-Type': 'application/json'
    });

    const params = new HttpParams()
      .set('active', 'true')
      .set('sort', 'name');

    return this._http.get<Event[]>(this.apiEventsUrl, {
      params: params,
      headers: headers
    }).pipe(
      map((events: any[]) => events.map(e => ({
        ...e,
        date: new Date(e.date)
      }))),
      catchError((error: HttpErrorResponse) => this.errorService.handleError(error))
    );
  }

  // Exercice 1 - C: GET avec observe: 'response'
  getAllEventsWithResponse(): Observable<HttpResponse<Event[]>> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer 123',
      'Content-Type': 'application/json'
    });

    const params = new HttpParams()
      .set('active', 'true')
      .set('sort', 'name');

    return this._http.get<Event[]>(this.apiEventsUrl, {
      params: params,
      headers: headers,
      observe: 'response'
    }).pipe(
      map((response: HttpResponse<any[]>) => {
        const events = response.body?.map(e => ({
          ...e,
          date: new Date(e.date)
        })) || [];
        return new HttpResponse({
          body: events as Event[],
          headers: response.headers,
          status: response.status,
          statusText: response.statusText,
          url: response.url || undefined
        });
      }),
      catchError((error: HttpErrorResponse) => this.errorService.handleError(error))
    );
  }

  // Exercice 2: Transformer la réponse avec opérateurs RxJS
  getExpensiveEvents(): Observable<Array<{ title: string; finalPrice: number }>> {
    return this._http.get<Event[]>(this.apiEventsUrl).pipe(
      // Filtrer les événements avec prix > 50
      map(events => events.filter(e => e.prix > 50)),
      // Transformer chaque événement en objet simplifié
      map(events => events.map(e => ({
        title: e.titre,
        finalPrice: e.prix * 1.2 // TVA 20%
      }))),
      // Gérer les erreurs en retournant un tableau vide
      catchError(() => {
        console.log('Erreur lors de la récupération des événements coûteux');
        return of([]);
      })
    );
  }

  // GET un événement par ID
  getEventById(id: number): Observable<Event> {
    return this._http.get<Event>(`${this.apiEventsUrl}/${id}`).pipe(
      map((event: any) => ({
        ...event,
        date: new Date(event.date)
      })),
      catchError((error: HttpErrorResponse) => this.errorService.handleError(error))
    );
  }

  // POST: Créer un nouvel événement
  addEvent(event: Partial<Event>): Observable<Event> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Convertir la date en string ISO pour le backend
    const eventToSend = {
      ...event,
      date: event.date instanceof Date ? event.date.toISOString() : event.date
    };

    return this._http.post<Event>(this.apiEventsUrl, eventToSend, { headers }).pipe(
      map((newEvent: any) => ({
        ...newEvent,
        date: newEvent.date ? new Date(newEvent.date) : new Date()
      })),
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur lors de la création:', error);
        return this.errorService.handleError(error);
      })
    );
  }

  // PUT: Mettre à jour un événement
  updateEvent(event: Event): Observable<Event> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Convertir la date en string ISO pour le backend
    const eventToSend = {
      ...event,
      date: event.date instanceof Date ? event.date.toISOString() : event.date
    };

    return this._http.put<Event>(`${this.apiEventsUrl}/${event.id}`, eventToSend, { headers }).pipe(
      map((updatedEvent: any) => ({
        ...updatedEvent,
        date: updatedEvent.date ? new Date(updatedEvent.date) : new Date()
      })),
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur lors de la mise à jour:', error);
        return this.errorService.handleError(error);
      })
    );
  }

  // DELETE: Supprimer un événement
  deleteEvent(id: number): Observable<void> {
    return this._http.delete<void>(`${this.apiEventsUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => this.errorService.handleError(error))
    );
  }

  // Méthodes de compatibilité pour l'ancien code (utilisant BehaviorSubject)
  // Ces méthodes peuvent être supprimées une fois que tout le code est migré vers HttpClient
  getEvents(): Observable<Event[]> {
    return this.getAllEventsFromBackend();
  }

  getEventsValue(): Event[] {
    // Note: Cette méthode n'est plus synchrone avec HttpClient
    // Elle retourne un tableau vide et devrait être remplacée par getAllEventsFromBackend()
    console.warn('getEventsValue() est obsolète. Utilisez getAllEventsFromBackend() avec subscribe()');
    return [];
  }
}

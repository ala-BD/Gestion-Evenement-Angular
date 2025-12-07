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

  // Helper pour normaliser un événement (garder l'ID tel quel - nombre ou chaîne)
  private normalizeEvent(event: any): Event {
    return {
      ...event,
      id: event.id !== undefined && event.id !== null ? event.id : 0,
      date: event.date ? new Date(event.date) : new Date()
    };
  }

  // Helper pour normaliser un tableau d'événements
  private normalizeEvents(events: any[]): Event[] {
    if (!events || !Array.isArray(events)) {
      return [];
    }
    return events.map(e => this.normalizeEvent(e));
  }

  // Exercice 1 - A: Récupération des données avec GET
  getAllEventsFromBackend(): Observable<Event[]> {
    return this._http.get<Event[]>(this.apiEventsUrl).pipe(
      map((events: any[]) => this.normalizeEvents(events)),
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
      map((events: any[]) => this.normalizeEvents(events)),
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
        const events = this.normalizeEvents(response.body || []);
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

  // GET un événement par ID (accepte nombre ou chaîne)
  getEventById(id: number | string): Observable<Event> {
    return this._http.get<Event>(`${this.apiEventsUrl}/${id}`).pipe(
      map((event: any) => this.normalizeEvent(event)),
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
      map((newEvent: any) => {
        console.log('Réponse brute du backend:', newEvent);
        const normalized = this.normalizeEvent(newEvent);
        console.log('Événement normalisé:', normalized);
        return normalized;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur lors de la création:', error);
        return this.errorService.handleError(error);
      })
    );
  }

  // Workshop: Méthode addEventToBackend() pour ajouter un événement dans le backend
  addEventToBackend(event: Partial<Event>): Observable<Event> {
    return this.addEvent(event);
  }

  // GET: Récupérer les événements par organizerId
  getEventsByOrganizerId(organizerId: number): Observable<Event[]> {
    const params = new HttpParams().set('organizerId', organizerId.toString());
    
    return this._http.get<Event[]>(this.apiEventsUrl, { params }).pipe(
      map((events: any[]) => this.normalizeEvents(events)),
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur dans getEventsByOrganizerId:', error);
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
      map((updatedEvent: any) => this.normalizeEvent(updatedEvent)),
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur lors de la mise à jour:', error);
        return this.errorService.handleError(error);
      })
    );
  }

  // DELETE: Supprimer un événement (accepte nombre ou chaîne)
  deleteEvent(id: number | string): Observable<void> {
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

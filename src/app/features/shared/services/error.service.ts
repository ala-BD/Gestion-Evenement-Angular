import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor() { }

  handleError(error: HttpErrorResponse) {
    let message = "";

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      message = `Erreur réseau : ${error.error.message}`;
    } else {
      // Erreur côté serveur
      message = `Erreur serveur (${error.status}): ${error.message}`;
    }
    console.log(message);
    return throwError(() => message);
  }
}


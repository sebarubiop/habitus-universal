import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError as observableThrowError } from 'rxjs'
import { catchError } from 'rxjs/operators'

@Injectable({
    providedIn: 'root',
  })
export class DataService {

  constructor(private http: HttpClient) { }

  getRegionesComunas() {
    return this.http.get<any>('https://reqres.in/api/users?delay=3').pipe(
      catchError(this.errorHandler))

  }

  errorHandler(error: HttpErrorResponse) {
    return observableThrowError(error.message || 'Server Error');
  }

}
import { Injectable, Inject } from '@angular/core'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Router } from '@angular/router'
import { throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { LOCAL_STORAGE } from '@ng-toolkit/universal'

import { environment } from '../../environments/environment'
import { UserResponse, User } from '@app/model/user'
import { UpdateResponse } from '@app/model/response'

@Injectable({
  providedIn: "root"
})
export class AuthenticationService {

  private domain = environment.domain
  authToken: string
  user: User

  constructor(
    @Inject(LOCAL_STORAGE) private localStorage: any,
    private http: HttpClient,
    private router: Router,
  ) { }

  registerUser(user: User) {
    return this.http.post<UserResponse>(`${this.domain}/register`, user).pipe(
      catchError(this.errorHandler))
  }

  loginUser(user: User) {
    return this.http.post<UserResponse>(`${this.domain}/login`, user).pipe(
      catchError(this.errorHandler))
  }

  loggedIn() {
    return !!this.localStorage.getItem('token')
  }

  // Function to logout
  logoutUser() {
    this.authToken = null; // Set token to null
    this.user = null; // Set user to null
    this.localStorage.clear(); // Clear local storage
    this.router.navigate(['/'])
  }

  // Function to store user's data in client local storage
  storeUserData(user: User, token?: string) {
    this.localStorage.setItem('token', token); // Set token in local storage
    this.localStorage.setItem('user', JSON.stringify(user)); // Set user in local storage as string
    this.authToken = token; // Assign token to be used elsewhere
    this.user = user; // Set user to be used elsewhere
  }

  getToken() {
    return this.localStorage.getItem('token')
  }

  getUserFromStorage(){
    return this.localStorage.getItem('user') ? JSON.parse(this.localStorage.getItem('user')) : null
  }

  getUserFromDb() {
    return this.http.get<UserResponse>(`${this.domain}/me`).pipe(
      catchError(this.errorHandler))
  }

  getUserFromDb2(userId: string, email: string) {
    return this.http.get<UserResponse>(`${this.domain}/me2`, { params: { userId: userId, email: email } }).pipe(
      catchError(this.errorHandler))
  }

  // Function to check if e-mail is taken
  checkEmail(email: string) {
    return this.http.get<UserResponse>(`${this.domain}/checkEmail/${email}`).pipe(
      catchError(this.errorHandler))
  }

  updateUser(id: string, params: User) {
    return this.http.put<UpdateResponse>(`${this.domain}/updateuser/${id}`, params).pipe(
      catchError(this.errorHandler))
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error.message || 'Server Error')
  }

}

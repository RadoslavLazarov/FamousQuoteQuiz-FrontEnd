import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser$: Observable<User>;

  constructor(private http: HttpClient, private router: Router) {
      // Check if localStorage has item currentUser then parse it into an object or return null
      this.currentUserSubject = new BehaviorSubject<User>(
        localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser') || '{}') : null);
      this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
      return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<void> {
      return this.http.post<any>(`${environment.apiUrl}/Authenticate/login`, { username, password })
          .pipe(map(user => {
              // store user details and jwt token in local storage to keep user logged in between page refreshes
              localStorage.setItem('currentUser', JSON.stringify(user));
              this.currentUserSubject.next(user);
              return user;
          }));
  }

  logout(): void {
      // remove user from local storage to log user out
      localStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
      this.router.navigate(['/login']);
  }

  register(username: string, email: string, password: string): Observable<void> {
    return this.http.post<any>(`${environment.apiUrl}/Authenticate/register`, { username, email, password });
  }
}

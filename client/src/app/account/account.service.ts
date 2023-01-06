import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, of, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';

/* Custon Interfaces */
import { IUser } from 'src/app/shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl: string = environment.apiUrl;

  // In case of the checkout page. The replay subject is going to wait until currentUser$ has a value before executing logic from the auth guard
  private currentUserSource: ReplaySubject<IUser> = new ReplaySubject(1);
  currentUser$: Observable<IUser> = this.currentUserSource.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  loadCurrentUser(token: string) {

    // this check is needed in order to give the currentUser$ an acctual value otherwise the auth guard does hang and not work.
    // This is because we use a ReplaySubject, which means, that it is going to wait until there is a value
    if(token === null) {
      this.currentUserSource.next(null)
      // Need to return an observable because the calling method expects it
      return of(null);
    }

    // Set the authorization headers
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    // Make the request by passing the headers in the request
    return this.http.get<IUser>(this.baseUrl + '/account', { headers }).pipe(
      map((user: IUser) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
        }
      })
    );
  }

  login(values: any): Observable<void> {
    return this.http.post(this.baseUrl + '/account/login', values).pipe(
      map((user: IUser) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
        }
      })
    );
  }

  register(values: any): Observable<void> {
    return this.http.post(this.baseUrl + '/account/register', values).pipe(
      map((user: IUser) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
        }
      })
    )
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSource.next(null);
    this.router.navigateByUrl('/');
  }

  checkEmailExists(email: string) {
    return this.http.get(this.baseUrl + '/account/emailExists?email=' + email);
  }

}

import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {retry, catchError} from "rxjs/operators";
import {User} from "../models/user";

@Injectable({providedIn: 'root'})

export class UsersService {
  base_path = '/api/users';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
  }

  // Handle API errors
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };

  createUser(user): Observable<User> {
    return this.http
      .post<User>(this.base_path, JSON.stringify(user), this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  fetchUser(id): Observable<User> {
    return this.http
      .get<User>(`${this.base_path}/${id}`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  fetchUsers(): Observable<User> {
    return this.http.get<User>(this.base_path)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  updateUser(id, item): Observable<User> {
    return this.http
      .put<User>(`${this.base_path}/${id}`, JSON.stringify(item), this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  deleteUser(id) {
    return this.http
      .delete<User>(`${this.base_path}/${id}`, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

}

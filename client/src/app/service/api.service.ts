import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiResponse} from "../model/api.response";
import {User} from "../model/user.model";

@Injectable({providedIn: 'root'})

export class ApiService {
  baseUrl: string = '/api/v1/users';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
  }

  getUsers(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.baseUrl);
  }

  getUsersByRole(role): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.baseUrl}?role=${role}`);
  }

  createUser(user: User): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.baseUrl, JSON.stringify(user), this.httpOptions);
  }

  getUser(id: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.baseUrl}/${id}`)
  }

  updateUser(id: string, user: User): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.baseUrl}/${id}`, JSON.stringify(user), this.httpOptions)
  }

  deleteUser(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/${id}`);
  }

  deleteSelectedUsers(users): Observable<ApiResponse> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: users,
    };
    return this.http.delete<ApiResponse>(this.baseUrl, options);
  }
}

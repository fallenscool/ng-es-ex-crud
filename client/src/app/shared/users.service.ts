import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";

export interface User {
  id: number,
  "create/update": string
  name: string
  surname: string
  birthday: string
  phone: string
  email: string
}

@Injectable({providedIn: 'root'})
export class UsersService {
  public users: User[] = [];

  constructor(private http: HttpClient) {
  }

  fetchUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users')
      .pipe(tap(users => this.users = users))
  }
}

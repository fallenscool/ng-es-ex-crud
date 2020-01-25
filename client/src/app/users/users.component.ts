import {Component, OnInit} from '@angular/core';
import {UsersService} from "../shared/users.service";
import {delay} from "rxjs/operators";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  private loading: boolean = true;

  constructor(private usersService: UsersService) {
  }

  ngOnInit() {
    this.usersService.fetchUsers()
      .pipe(delay(500))
      .subscribe(() => {
        this.loading = false
      })
  }

}

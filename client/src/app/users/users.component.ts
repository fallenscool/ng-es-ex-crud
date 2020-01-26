import {Component, OnInit} from '@angular/core';
import {UsersService} from "../shared/users.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  private loading: boolean = true;
  private users: any;

  constructor(private usersService: UsersService) {
    this.users = []
  }

  ngOnInit() {
    this.getAllUsers();
  }
  //Get all users
  getAllUsers() {
    this.usersService.fetchUsers()
      .subscribe(response => {
        this.loading = false;
        this.users = response;
      })
  }
  //Delete user by id
  deleteUser(id) {
    this.usersService.deleteUser(id).subscribe(Response => {
      this.getAllUsers();
    });
  }
}

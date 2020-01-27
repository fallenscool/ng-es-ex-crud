import {Component, OnInit} from '@angular/core';
import {UsersService} from "../shared/users.service";
import {Router} from "@angular/router";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})

export class UsersComponent implements OnInit {
  private loading: boolean = true;
  private users: any;
  private searchString: string;
  private lowValue: number = 0;
  private highValue: number = 5;


  constructor(private usersService: UsersService, private router: Router) {
    this.users = []
  }

  ngOnInit() {
    this.getAllUsers();
  }

  // Get all users
  getAllUsers() {
    this.usersService.fetchUsers()
      .subscribe(response => {
        this.loading = false;
        this.users = response;
      })
  }

  // Delete user by id
  deleteUser(id: number) {
    this.usersService.deleteUser(id)
      .subscribe(Response => {
        this.getAllUsers();
      });
  }

  editUser(id: number) {
    return this.router.navigate([`/edit/${id}`]);
  }

  getPaginatorData(event: PageEvent): PageEvent {
    this.lowValue = event.pageIndex * event.pageSize;
    this.highValue = this.lowValue + event.pageSize;
    return event;
  }
}

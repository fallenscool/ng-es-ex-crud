import {Component, OnInit} from '@angular/core';
import {UsersService} from "../shared/users.service";
import {Router} from "@angular/router";
import * as moment from 'moment';
import {User} from "../models/user";

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  private data:User = new User();

  constructor(public usersService: UsersService, public router: Router) {
  }

  ngOnInit() {
  }

  submitForm() {
    let newUser = this.data;
    if (newUser.birthday) {
      newUser.birthday = moment(newUser.birthday).format('DD.MM.YYYY');
    }
    this.usersService.createUser(newUser).subscribe(res => {
      this.router.navigate(['']);
    });
  }
}

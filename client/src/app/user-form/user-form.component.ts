import {Component, OnInit} from '@angular/core';
import {UsersService} from "../shared/users.service";
import {Router} from "@angular/router";
import * as _ from 'lodash';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../models/user";

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})

export class UserFormComponent implements OnInit {
  private myForm: FormGroup;
  private submitted: boolean = false;
  private editing: boolean = false;
  private User: User;
  private loading: boolean = true;

  constructor(public usersService: UsersService, public router: Router, public fb: FormBuilder) {
    this.User = new User();
  }

  ngOnInit() {
    this.editing = !!this.router.url.includes('edit');
    if (this.editing) {
      let id = Number(_.last(this.router.url.split('/')));
      return this.getUser(id);
    }
    this.reactiveForm();
    this.loading = false;
  }

  reactiveForm() {
    this.myForm = this.fb.group({
      name: [this.editing ? this.User.name : '', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
      surname: [this.editing ? this.User.surname : '', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
      email: [this.editing ? this.User.email : '', [Validators.required, Validators.email]],
      phone: [this.editing ? this.User.phone : '', [Validators.required, Validators.pattern(/^0\d{9}$/)]],
      birthday: [this.editing ? this.User.birthday : '', [Validators.required]],
    })
  }

  getUser(id: number) {
    this.usersService.fetchUser(id)
      .subscribe(response => {
        this.User = response;
        this.reactiveForm();
        this.loading = false;
      })
  }

  public errorHandling = (control: string, error: string) => {
    return this.myForm.controls[control].hasError(error);
  };

  submitForm(id: number) {
    this.submitted = true;

    if (this.myForm.invalid) {
      return console.log('error');
    }
    this.User = this.myForm.value;

    if (this.editing) {
      return this.usersService.updateUser(id, this.User).subscribe(res => {
        console.log(res);
        this.router.navigate(['list']);
      });
    }

    return this.usersService.createUser(this.User).subscribe(res => {
      console.log(res);
      this.router.navigate(['list']);
    });
  }
}

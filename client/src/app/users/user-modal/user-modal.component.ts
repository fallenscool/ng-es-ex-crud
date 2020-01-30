import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../../model/user.model";
import {ApiService} from "../../service/api.service";

export interface DialogData {
  userId: string;
  editing: boolean;
}

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss']
})


export class UserModalComponent implements OnInit {
  myForm: FormGroup;
  submitted: boolean = false;
  User: User;
  loading: boolean = true;

  constructor(public dialogRef: MatDialogRef<UserModalComponent>,
              public apiService: ApiService, public fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.User = new User();
  }

  ngOnInit() {
    if (this.data.editing) {
      return this.getUser(this.data.userId);
    }
    this.reactiveForm();
    this.loading = false;
  }

  reactiveForm() {
    this.myForm = this.fb.group({
      name: [this.data.editing ? this.User.name : '', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
      surname: [this.data.editing ? this.User.surname : '', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
      email: [this.data.editing ? this.User.email : '', [Validators.required, Validators.email]],
      phone: [this.data.editing ? this.User.phone : '', [Validators.required, Validators.pattern(/^0\d{9}$/)]],
      birthday: [this.data.editing ? this.User.birthday : '', [Validators.required]],
      role: [this.data.editing ? this.User.role : '', [Validators.required]],
      gender: [this.data.editing ? this.User.gender : '', [Validators.required]]
    })
  }

  getUser(id: string) {
    this.apiService
      .getUser(id)
      .subscribe(({result}) => {
        this.User = result;
        this.reactiveForm();
        this.loading = false;
      })
  }

  deleteUser(e) {
    e.preventDefault();
    this.apiService.deleteUser(this.data.userId)
      .subscribe(result => {
        return this.dialogRef.close();
      })
  }

  public errorHandling = (control: string, error: string) => {
    return this.myForm.controls[control].hasError(error);
  };

  submitForm() {
    this.submitted = true;
    if (this.myForm.invalid) {
      return console.log('error');
    }
    this.User = this.myForm.value;

    if (this.data.editing) {
      return this.apiService.updateUser(this.data.userId, this.User)
        .subscribe(res => {
          return this.dialogRef.close();
        });
    }

    return this.apiService.createUser(this.User)
      .subscribe(res => {
        return this.dialogRef.close();
      });
  }
}

import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {ApiService} from "../service/api.service";
import {User} from "../model/user.model";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import {MatDialog} from "@angular/material/dialog";
import {UserModalComponent} from "./user-modal/user-modal.component";


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})

export class UsersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['select', 'id', 'name', 'email', 'phone', 'birthday', 'gender'];
  isLoadingResults: boolean = true;
  resultsLength: number = 0;
  roles: string[] = [];

  usersData = new MatTableDataSource<User[]>();
  selection = new SelectionModel<User>(true, []);

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  constructor(private apiService: ApiService, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.getAllUsers();
  }

  ngAfterViewInit() {
    this.usersData.paginator = this.paginator;
  }

  public getUsersByRole(role) {
    this.isLoadingResults = true;
    this.apiService.getUsersByRole(role).subscribe(({result}) => {
      this.usersData.data = result.hits.hits;
      this.isLoadingResults = false;
      this.resultsLength = result.hits.hits.length;
    });
  }

  public getAllUsers() {
    this.isLoadingResults = true;
    this.apiService.getUsers()
      .subscribe(({result}) => {
        this.usersData.data = result.hits.hits;
        this.roles = result.aggregations.role.buckets.map(item => item.key);
        this.isLoadingResults = false;
        this.resultsLength = result.hits.total.value;
        this.usersData.paginator = this.paginator;
      });
  }


  public calculateUserAge(birth: Date) {
    return new Date().getFullYear() - new Date(birth).getFullYear()
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.usersData.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      // @ts-ignore
      this.usersData.data.forEach(user => this.selection.select(user));
  }

  checkboxLabel(user?: User): string {
    if (!user) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(user) ? 'deselect' : 'select'} row ${user.id + 1}`;
  }

  openModal(id?: string) {
    let data = {};
    if (id) {
      data = {
        userId: id,
        editing: !!id
      }
    }
    const userModal = this.dialog.open(UserModalComponent, {
      width: '500px',
      data,
    });

    userModal
      .afterClosed()
      .subscribe(res => {
        this.getAllUsers();
      });
  }

  deleteSelectedUsers() {
    const selectedUsersIds: {} = {};
    // @ts-ignore
    this.selection.selected.map((user, index) => selectedUsersIds[index] = (user._id));
    this.apiService.deleteSelectedUsers(selectedUsersIds)
      .subscribe(res => {
        console.log(res);
        return this.getAllUsers();
      });
  }
}

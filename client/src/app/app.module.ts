import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from "@angular/common/http";

import {AppComponent} from './app.component';
import {MaterialModule} from './material/material.module';
import {UsersComponent} from './users/users.component';
import {AppRoutingModule} from "./app-routing.module";
import {UserModalComponent} from './users/user-modal/user-modal.component';


@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    UserModalComponent,
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule
  ],
  entryComponents: [UserModalComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from "ngx-spinner";

import * as $ from 'jquery';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSlickgridModule } from 'angular-slickgrid';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AuthGuard } from './auth.guard';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './features/header/header.component';
import { FooterComponent } from './features/footer/footer.component';
import { BooksComponent } from './features/books/books.component';
import { AuthorsComponent } from './features/authors/authors.component';
import { AdminComponent } from './features/admin/admin.component';
import { BookViewComponent } from './features/books/book-view/book-view.component';
import { BookCreateComponent } from './features/books/book-create/book-create.component';
import { BookEditComponent } from './features/books/book-edit/book-edit.component';
import { AuthorViewComponent } from './features/authors/author-view/author-view.component';
import { AuthorCreateComponent } from './features/authors/author-create/author-create.component';
import { AuthorEditComponent } from './features/authors/author-edit/author-edit.component';
import { HomeComponent } from './features/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    BooksComponent,
    AuthorsComponent,
    AdminComponent,
    BookCreateComponent,
    BookEditComponent,
    AuthorCreateComponent,
    AuthorEditComponent,
    AuthorViewComponent,
    BookViewComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    NgSelectModule,
    NgxSpinnerModule,
    AngularSlickgridModule.forRoot(),
    NgbModule,
    BrowserAnimationsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [FormsModule, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }

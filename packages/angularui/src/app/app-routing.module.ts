import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BooksComponent } from './features/books/books.component';
import { AuthorsComponent } from './features/authors/authors.component';
import { AdminComponent } from './features/admin/admin.component';
import { HomeComponent } from './features/home/home.component';
import { BookViewComponent } from './features/books/book-view/book-view.component';
import { BookEditComponent } from './features/books/book-edit/book-edit.component';
import { BookCreateComponent } from './features/books/book-create/book-create.component';
import { AuthorViewComponent } from './features/authors/author-view/author-view.component';
import { AuthorEditComponent } from './features/authors/author-edit/author-edit.component';
import { AuthorCreateComponent } from './features/authors/author-create/author-create.component';

import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path:  "", 
    pathMatch:  "full",
    redirectTo: "/home"
  },
  {path: "home", component: HomeComponent}, 
  {path: "books", component: BooksComponent, canActivate: [AuthGuard]},
  {path: "authors", component: AuthorsComponent, canActivate: [AuthGuard]},
  {path: "admin", component: AdminComponent, canActivate: [AuthGuard]},
  {path: "viewbook/:id", component: BookViewComponent, canActivate: [AuthGuard]},
  {path: "editbook/:id", component: BookEditComponent, canActivate: [AuthGuard]},
  {path: "newbook", component: BookCreateComponent, canActivate: [AuthGuard]},
  {path: "viewauthor/:id", component: AuthorViewComponent, canActivate: [AuthGuard]},
  {path: "editauthor/:id", component: AuthorEditComponent, canActivate: [AuthGuard]},
  {path: "newauthor", component: AuthorCreateComponent, canActivate: [AuthGuard]},  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

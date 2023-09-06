import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { NativeScriptRouterModule } from '@nativescript/angular'

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'dummy',
    loadChildren: () => import('./features/dummy/dummy.module').then(m => m.DummyModule)
  },  
  {
    path: 'books',
    loadChildren: () => import('./features/books/books.module').then(m => m.BooksModule)
  }, 
  {
    path: 'authors',
    loadChildren: () => import('./features/authors/authors.module').then(m => m.AuthorsModule)
  }, 
  {
    path: 'login',
    loadChildren: () => import('./features/login/login.module').then(m => m.LoginModule)
  },  
  {
    path: "books/:id",
    loadChildren: () =>
      import("./features/books/book.edit.module").then(m => m.BookEditModule)
  },
  {
    path: "authors/:id",
    loadChildren: () =>
      import("./features/authors/author.edit.module").then(m => m.AuthorEditModule)
  },  
]

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}

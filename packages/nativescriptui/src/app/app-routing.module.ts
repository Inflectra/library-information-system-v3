import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { NativeScriptRouterModule, NSEmptyOutletComponent } from '@nativescript/angular'
import { BookEditComponent } from './features/books/book.edit.component'
import { AuthorEditComponent } from './features/authors/author.edit.component'

const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/(homeTab:emptyHome/dummy//booksTab:emptyBooks/dummy//authorsTab:emptyAuthors/dummy//accountTab:emptyAccount/dummy)', 
    pathMatch: 'full' 
  },
  {
    path: 'home',
    component: NSEmptyOutletComponent,
    loadChildren: () => import('./features/home/home.module').then((m) => m.HomeModule),
    outlet: 'homeTab',
  },
  {
    path: 'books',
    component: NSEmptyOutletComponent,
    loadChildren: () => import('./features/books/books.module').then((m) => m.BooksModule),
    outlet: 'booksTab',
  },
  {
    path: 'authors',
    component: NSEmptyOutletComponent,
    loadChildren: () => import('./features/authors/authors.module').then((m) => m.AuthorsModule),
    outlet: 'authorsTab',
  },  
  {
    path: 'login',
    component: NSEmptyOutletComponent,
    loadChildren: () => import('./features/login/login.module').then((m) => m.LoginModule),
    outlet: 'accountTab',
  },
  {
    path: "book/:id",
    component: BookEditComponent,
    outlet: "booksTab"
  },   
  {
    path: "author/:id",
    component: AuthorEditComponent,
    outlet: "authorsTab"
  },
  {
    path: "emptyHome",
    component: NSEmptyOutletComponent,
    loadChildren: () => import('./features/dummy/dummy.module').then((m) => m.DummyModule),
    outlet: "homeTab"
  },  
  {
    path: "emptyBooks",
    component: NSEmptyOutletComponent,
    loadChildren: () => import('./features/dummy/dummy.module').then((m) => m.DummyModule),
    outlet: "booksTab"
  }, 
  {
    path: "emptyAuthors",
    component: NSEmptyOutletComponent,
    loadChildren: () => import('./features/dummy/dummy.module').then((m) => m.DummyModule),
    outlet: "authorsTab"
  },
  {
    path: "emptyAccount",
    component: NSEmptyOutletComponent,
    loadChildren: () => import('./features/dummy/dummy.module').then((m) => m.DummyModule),
    outlet: "accountTab"
  }  
  
]

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}

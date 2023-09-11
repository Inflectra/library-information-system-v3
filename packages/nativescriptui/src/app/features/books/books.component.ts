import { Component, Input } from '@angular/core'
import { ItemEventData, Dialogs } from "@nativescript/core";
import { RouterExtensions } from "@nativescript/angular";
import { BookModel, BookService } from "~/app/core";
import { LoginService } from '~/app/core';

@Component({
  moduleId: module.id,
  selector: 'ns-books',
  templateUrl: 'books.component.html'
})

export class BooksComponent {

  @Input() books = [];

  constructor(
    private routerExtensions: RouterExtensions,
    private bookService: BookService,
    public loginService: LoginService
  ) {}

  ngOnInit(): void {
    console.log("Init Books");
  }

  onLoaded() {
    console.log("Load Books");

    if (this.loginService.isAuthenticated())
    {
      this.bookService.loadBooks().then((books) => {
        this.books = books;
      });    
    }
    else
    {
      this.books = [];
    }
  }

  onBookTap(args: ItemEventData): void {
    console.log("BOOK TAP");
  }

  onEditButton(button, item: BookModel) {
    var msg = "Edit button pressed: " + item.id;
    console.log(msg);
    button.className = "";
    button.className = "highlighted";
    this.routerExtensions.navigate([{ outlets: { booksTab: [ "book", item.id ] }}]);
  }

  onDeleteButton(button, item: BookModel) {
    var msg = "Delete button pressed: " + item.id;
    console.log(msg);
    button.className = "";
    button.className = "highlighted";
    this.bookService.deleteBook(item.id).then(() => {
      this.books = this.books.filter(b => b.id != item.id);
    });
  }  

  showAlertDialog(msg) {
    const alertOptions = {
      title: "Information",
      message: msg,
      okButtonText: 'OK',
      cancelable: false // [Android only] Gets or sets if the dialog can be canceled by taping outside of the dialog.
    }
  
    Dialogs.alert(alertOptions).then(() => {
      console.log("Alert dialog closed")
    })
  }  

}

import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "@nativescript/angular";
import { BooksRoutingModule } from "./books-routing.module";

import { BooksComponent } from "./books.component";
import { BookEditComponent } from './book.edit.component'

@NgModule({
  imports: [NativeScriptCommonModule, BooksRoutingModule],
  declarations: [BooksComponent, BookEditComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class BooksModule {}

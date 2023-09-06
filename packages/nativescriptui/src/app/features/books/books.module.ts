import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "@nativescript/angular";
import { BooksRoutingModule } from "./books-routing.module";
import { BooksComponent } from "./books.component";

@NgModule({
  imports: [NativeScriptCommonModule, BooksRoutingModule],
  declarations: [BooksComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class BooksModule {}

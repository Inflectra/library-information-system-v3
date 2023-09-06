import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "@nativescript/angular";
import { BookEditRoutingModule } from "./book.edit-routing.module";
import { BookEditComponent } from "./book.edit.component";

@NgModule({
  imports: [NativeScriptCommonModule, BookEditRoutingModule],
  declarations: [BookEditComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class BookEditModule {}

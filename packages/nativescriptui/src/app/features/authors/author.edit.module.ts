import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "@nativescript/angular";
import { AuthorEditRoutingModule } from "./author.edit-routing.module";
import { AuthorEditComponent } from "./author.edit.component";

@NgModule({
  imports: [NativeScriptCommonModule, AuthorEditRoutingModule],
  declarations: [AuthorEditComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AuthorEditModule {}

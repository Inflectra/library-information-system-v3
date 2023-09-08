import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "@nativescript/angular";
import { AuthorsRoutingModule } from "./authors-routing.module";

import { AuthorsComponent } from "./authors.component";
import { AuthorEditComponent } from './author.edit.component'

@NgModule({
  imports: [NativeScriptCommonModule, AuthorsRoutingModule],
  declarations: [AuthorsComponent, AuthorEditComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AuthorsModule {}

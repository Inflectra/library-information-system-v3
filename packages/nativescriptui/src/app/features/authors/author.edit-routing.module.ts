import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";
import { AuthorEditComponent } from "./author.edit.component";

export const routes: Routes = [
  {
    path: "",
    component: AuthorEditComponent
  }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)]
})
export class AuthorEditRoutingModule {}

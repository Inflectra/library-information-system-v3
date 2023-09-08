import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";
import { AuthorsComponent } from "./authors.component";

export const routes: Routes = [
  {
    path: "default",
    component: AuthorsComponent
  }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)]
})
export class AuthorsRoutingModule {}

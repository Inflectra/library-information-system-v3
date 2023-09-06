import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";
import { BookEditComponent } from "./book.edit.component";

export const routes: Routes = [
  {
    path: "",
    component: BookEditComponent
  }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)]
})
export class BookEditRoutingModule {}

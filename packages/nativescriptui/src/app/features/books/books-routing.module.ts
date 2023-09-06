import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";
import { BooksComponent } from "./books.component";

export const routes: Routes = [
  {
    path: "",
    component: BooksComponent
  }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)]
})
export class BooksRoutingModule {}

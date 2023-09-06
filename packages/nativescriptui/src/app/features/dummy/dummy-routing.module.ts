import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";
import { DummyComponent } from "./dummy.component";

export const routes: Routes = [
  {
    path: "",
    component: DummyComponent
  }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)]
})
export class DummyRoutingModule {}

import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "@nativescript/angular";
import { DummyRoutingModule } from "./dummy-routing.module";
import { DummyComponent } from "./dummy.component";

@NgModule({
  imports: [NativeScriptCommonModule, DummyRoutingModule],
  declarations: [DummyComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class DummyModule {}

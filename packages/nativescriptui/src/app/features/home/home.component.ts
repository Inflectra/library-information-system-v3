import { Component } from '@angular/core'
import { RouterExtensions } from "@nativescript/angular";
import { Application, AndroidActivityBackPressedEventData } from '@nativescript/core';
import { LoginService } from '~/app/core';
import { TabService } from '~/app/core';

@Component({
  moduleId: module.id,
  selector: 'ns-home',
  templateUrl: 'home.component.html'
})
export class HomeComponent {

  constructor(
    private routerExtensions: RouterExtensions,
    private loginService: LoginService,
    private tabService: TabService
  ) { }

  ngOnInit(): void {
    if (Application.android) {
      Application.android.on(Application.android.activityBackPressedEvent, (data: AndroidActivityBackPressedEventData) => {
        data.cancel = true;
      });
    }    
  }

  onSelectedIndexChanged(event)
  {
    this.tabService.onSelectedIndexChanged(event);
  }
}

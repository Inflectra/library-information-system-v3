import { Component } from '@angular/core'
import { Application, AndroidActivityBackPressedEventData } from '@nativescript/core';

@Component({
  moduleId: module.id,
  selector: 'ns-home',
  templateUrl: 'home.component.html'
})
export class HomeComponent {

  constructor() { 
  }

  ngOnInit(): void {
    console.log("Init Home");
    if (Application.android) {
      Application.android.on(Application.android.activityBackPressedEvent, (data: AndroidActivityBackPressedEventData) => {
        data.cancel = true;
      });
    }
  }

  onLoaded()
  {
    console.log("Load Home");    
  }

}

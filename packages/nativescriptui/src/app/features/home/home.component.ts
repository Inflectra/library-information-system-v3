import { Component } from '@angular/core'
import { Application, AndroidActivityBackPressedEventData } from '@nativescript/core';
import { LoginService } from '~/app/core';

@Component({
  moduleId: module.id,
  selector: 'ns-home',
  templateUrl: 'home.component.html'
})
export class HomeComponent {

  public static WELCOME = "Welcome";

  welcomeMessage: string;

  constructor(public loginService: LoginService) { }

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

    if (this.loginService.isAuthenticated())
    {
      this.welcomeMessage = HomeComponent.WELCOME + ", " + this.loginService.getUsername() + "!";
    }
    else
    {
      this.welcomeMessage = HomeComponent.WELCOME;
    }
  }

}

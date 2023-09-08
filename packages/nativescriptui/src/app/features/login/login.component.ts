import { Component } from '@angular/core'
import { RouterExtensions } from "@nativescript/angular";
import { LoginService } from '~/app/core';

@Component({
  moduleId: module.id,
  selector: 'ns-login',
  templateUrl: 'login.component.html'
})

export class LoginComponent {

  public static INVALID_LOGIN = "Invalid username or password";

  username: string = "librarian";
  password: string = "librarian";
  state: any;
  invalidLogin: boolean = false;
  errorMessage: string = LoginComponent.INVALID_LOGIN;

  constructor(
    private routerExtensions: RouterExtensions,
    public loginService: LoginService
  ) {
  }

  onLogin(event)
  {
    this.errorMessage = LoginComponent.INVALID_LOGIN;

    this.loginService.login(this.username, this.password).then((result) =>
    {
      console.log("Logged in successfully");
    },
    (error) => {
      this.errorMessage = error;
      this.invalidLogin = true;
      setTimeout(() => { this.invalidLogin = false; }, 5000);      
    });
  }

  onLogout(event)
  {
    this.loginService.logout();
  }  
}

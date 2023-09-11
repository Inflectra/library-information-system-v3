import { Component } from '@angular/core'
import { RouterExtensions } from "@nativescript/angular";
import { BackendService, LoginService } from '~/app/core';
import { setString } from '@nativescript/core/application-settings';

@Component({
  moduleId: module.id,
  selector: 'ns-login',
  templateUrl: 'login.component.html'
})

export class LoginComponent {

  public static INVALID_LOGIN = "Invalid username or password";

  username: string = "librarian";
  password: string = "librarian";
  serverUrl: string;
  state: any;
  invalidLogin: boolean = false;
  errorMessage: string = LoginComponent.INVALID_LOGIN;

  constructor(
    private routerExtensions: RouterExtensions,
    public loginService: LoginService,
    private backendService: BackendService
  ) {
      this.serverUrl = this.backendService.getBackendUrl();
  }

  ngOnInit(): void {
    console.log("Init Account");
  }

  onLoaded() {
    console.log("Load Account");
  }

  onUsernameChange(event)
  {
    this.username = event.value;
  }

  onPasswordChange(event)
  {
    this.password = event.value;    
  }

  onServerUrlChange(event)
  {
      this.serverUrl = event.value;
  }

  onLogin(event)
  {
    this.errorMessage = LoginComponent.INVALID_LOGIN;

    var _username = ("" + this.username).toLowerCase();

    this.loginService.login(_username, this.password).then((result) =>
    {
      console.log("Logged in successfully");
      this.routerExtensions.navigate([{ outlets: { booksTab: [ "books", "default" ] }}]);
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

  onSave(event)
  {
    setString("ServerURL", this.serverUrl);
  }

}

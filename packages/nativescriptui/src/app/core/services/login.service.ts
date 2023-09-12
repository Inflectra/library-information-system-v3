import { Injectable } from "@angular/core";
import { BackendService } from "~/app/core/services";

@Injectable({
  providedIn: "root"
})

export class LoginService {

  user: any;
  authenticated: boolean = false;

  constructor(private backendService: BackendService) 
  { 
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  isAdmin(): boolean
  {
    if (this.user && this.user.permission  == Permissions.admin)
    {
      return true;

    }
    return false;
  }

  isEditor(): boolean
  {
    if (this.user && (this.user.permission  == Permissions.edit || this.user.permission == Permissions.admin))
    {
      return true;

    }
    return false;
  }  

  getUsername(): string
  {
    if(this.user && this.user.username)
    {
      return this.user.username;
    }

    return "TBD";
  }

  login(username: string, password: string) : Promise<boolean>
  {
    return new Promise<boolean>((resolve, reject) => {
      var _query = `users/login?username=${username}&password=${password}`;
      this.backendService.getDataFromBackend(_query).subscribe((data) => {
        console.log(JSON.stringify(data));
        this.authenticated = true;
        this.backendService.setToken(data.token);

        this.backendService.getDataFromBackend("users/" + username).subscribe((user) => {
          console.log(JSON.stringify(user));
          this.user = user;
          resolve(true);
        });
      },
      error => reject(error));
    });
  }
  
  logout()
  {
    this.backendService.getDataFromBackend("users/logout").subscribe(() => {
      this.authenticated = false;
      this.backendService.clearToken();
      
    });
  }
}

export enum Permissions {
  none = 0,
  view = 1,
  edit = 2,
  admin = 3
} 

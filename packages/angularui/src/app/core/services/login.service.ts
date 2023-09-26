import { Injectable } from "@angular/core";
import { DataService } from "../../data.service";

@Injectable({
  providedIn: "root"
})

export class LoginService {

  user: any;
  authenticated: boolean = false;

  constructor(private dataService: DataService) 
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
    if(this.user && this.user.name)
    {
      return this.user.name;
    }

    return "TBD";
  }

  getTenant(): string
  {
    return this.dataService.getTenant();
  }

  static arrayBufferToBase64(bytes) 
  {
    var binary = '';
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) 
    {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }  

  login(username: string, password: string) : Promise<boolean>
  {
    var _enc = new TextEncoder(); 
    var _base64String = LoginService.arrayBufferToBase64(_enc.encode(`${username}:${password}`));       
    var _authData = _base64String;
    var _authHeader = `Basic ${_authData}`;
    var _additionalHeaders = new Map<string, string>();
    _additionalHeaders.set("Authorization", _authHeader);

    return new Promise<boolean>((resolve, reject) => {
      this.dataService.getDataFromBackend("users/login", "get", null, _additionalHeaders).subscribe((data: any) => {
        console.log(JSON.stringify(data));
        this.authenticated = true;
        this.dataService.setToken(data.token);

        this.dataService.getDataFromBackend("users/" + username).subscribe((user) => {
          console.log(JSON.stringify(user));
          this.user = user;
          resolve(true);
        });
      },
      error => reject(error));
    });
  }
  
  logout() : Promise<boolean>
  {
    return new Promise<boolean>((resolve, reject) => {
      this.dataService.getDataFromBackend("users/logout").subscribe(() => {
        this.authenticated = false;
        this.dataService.clearToken();
        resolve(true);
      },
      error => reject(error));
    });
  }

  reset() : Promise<boolean>
  {
    return new Promise<boolean>((resolve, reject) => {
      this.dataService.getDataFromBackend("reset").subscribe(() => {
        resolve(true);
      },
      error => reject(error));
    });
  }
}

export enum Permissions {
  none = 0,
  view = 1,
  edit = 2,
  admin = 3
} 

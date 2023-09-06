import { Injectable } from "@angular/core";
import { BackendService } from "~/app/core/services";

@Injectable({
  providedIn: "root"
})

export class LoginService {

  authenticated: boolean = false;

  constructor(private backendService: BackendService) 
  { 
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  login(username: string, password: string) : Promise<boolean>
  {
    return new Promise<boolean>((resolve, reject) => {
      var _query = `users/login?username=${username}&password=${password}`;
      this.backendService.getDataFromBackend(_query).subscribe((data) => {
        console.log(JSON.stringify(data));
        this.authenticated = true;
        this.backendService.setToken(data.token);
        resolve(true);
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

import { Injectable } from "@angular/core";
import { RouterExtensions } from "@nativescript/angular";
import { LoginService } from '~/app/core';

@Injectable({
  providedIn: "root"
})

export class TabService {

  nextTab: string = null;

  constructor(private routerExtensions: RouterExtensions,
    public loginService: LoginService) 
  { 

  }

  getNextTab()
  {
    return this.nextTab;
  }

  setNextTab(name: string)
  {
    this.nextTab = name;
  }

 
}

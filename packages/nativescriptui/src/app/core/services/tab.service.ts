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

  onSelectedIndexChanged(event)
  {
    console.log(`Tab: oldIndex=${event.oldIndex}, newIndex=${event.newIndex}`);
    
    if (event.oldIndex == -1)
    {
      return;
    }

    var nextTab: string = null;

    if (event.newIndex == 0)
    {
      this.routerExtensions.navigate(["home"]);
    }
    else if (event.newIndex == 1)
    {
      nextTab = "books";
    }   
    else if (event.newIndex == 2)
    {
      nextTab = "authors";
    }
    else if (event.newIndex == 3)
    {
        this.routerExtensions.navigate(["login"]);
    }      

    if (nextTab)
    {
      if (this.loginService.isAuthenticated())
      {
        this.routerExtensions.navigate([nextTab]);
      }
      else
      {
        this.setNextTab(nextTab);
        if (this.routerExtensions.router.url == "/login")
        {
          this.routerExtensions.navigateByUrl('/dummy', {skipLocationChange: true}).then(() => {
            this.routerExtensions.navigate(["login"]);
          });    
        }
        else
        {
          this.routerExtensions.navigate(["login"]);
        }      
      }
    }
  }
  
}

import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from '../../data.service';
import { LoginService } from 'src/app/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [ '.nav-item{padding:2px; margin-left: 7px;}'
  ]
})
export class HeaderComponent implements OnInit {

  loggedUserName = "";

  constructor(private dataService: DataService, public loginService: LoginService, private router: Router) 
  { 
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd)
      {
        var url = event.url;
        this.dataService.setActiveMainMenuItem(url);
      }
    });    
  }

  ngOnInit(): void 
  {
  }

  ngOnDestroy(): void 
  {
  }
  
  toolbarItemClicked(event)
  {
    $("." + this.dataService.selectedRouteClassName).first().removeClass(this.dataService.selectedRouteClassName);
    event.target.classList.add(this.dataService.selectedRouteClassName);
  }

  logout(event)
  {
    this.loginService.logout().then(() => {
      this.dataService.userLoggedOutEvent.emit();
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { LoginService, LibraryService } from 'src/app/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent implements OnInit {

  constructor(public loginService: LoginService, public libraryService: LibraryService, private dataService: DataService) { 

    this.dataService.userLoggedOutEvent.subscribe(() => {
      this.username = "";
      this.password = "";
    });
  }

  errorMessage: string = "";

  username: string = "";
  password: string = "";

  ngOnInit(): void 
  {
  
  }

  onLogin(valid)
  {
    if (valid)
    {
      console.log("Username: " + this.username);
      console.log("Password: " + this.password);

      this.loginService.login(this.username, this.password).then((result) =>
      {
        console.log("Logged in successfully");
        this.libraryService.loadData().then((result) => {
          console.log("Library data loaded");
        });
      },
      (error) => {
        this.errorMessage = error;
        setTimeout(() => { this.errorMessage = ""; }, 5000);      
      });
    }
  }
}

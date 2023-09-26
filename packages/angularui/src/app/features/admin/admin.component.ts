import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/core';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styles: [
  ]
})
export class AdminComponent implements OnInit {

  constructor(public loginService: LoginService, private dataService: DataService) { }

  ngOnInit(): void {
  }
  
  reset()
  {
    this.loginService.reset().then(() => {
      this.dataService.showAlert("Database reset successfully.", "Admin");
    });
  }

}

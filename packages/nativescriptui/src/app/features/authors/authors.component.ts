import { Component } from '@angular/core'
import { ItemEventData } from "@nativescript/core";
import { RouterExtensions } from "@nativescript/angular";
import { AuthorService, LoginService } from "~/app/core";
import { AuthorModel } from '~/app/core';

@Component({
  moduleId: module.id,
  selector: 'ns-authors',
  templateUrl: 'authors.component.html'
})

export class AuthorsComponent {

  authors = [];

  constructor(
    private routerExtensions: RouterExtensions,
    private authorService: AuthorService,
    public loginService: LoginService
  ) {}

  ngOnInit(): void {
    console.log("Init Authors");
  }

  onLoaded() {
    console.log("Load Authors");

    if (this.loginService.isAuthenticated())
    {

      this.authorService.loadAuthors().then((authors) => {
        this.authors = authors;
      });    
    }
    else 
    {
      this.authors = [];      
    }    
  }

  onAuthorTap(args: ItemEventData): void {
    console.log("AUTHOR TAP");
  }

  onEditButton(button, item: AuthorModel) {
    var msg = "Edit button pressed: " + item.id;
    console.log(msg);
    button.className = "";
    button.className = "highlighted";
    this.routerExtensions.navigate([{ outlets: { authorsTab: [ "author", item.id ] }}]);
  }

}

import { Component } from '@angular/core'
import { ItemEventData } from "@nativescript/core";
import { RouterExtensions } from "@nativescript/angular";
import { AuthorService, TabService, LoginService } from "~/app/core";
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
    private tabService: TabService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    console.log("Init Authors");
  }

  onLoaded() {
    if (this.loginService.isAuthenticated())
    {
      console.log("Load Authors");
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

import { Component } from '@angular/core'
import { ItemEventData } from "@nativescript/core";
import { RouterExtensions } from "@nativescript/angular";
import { AuthorService, TabService } from "~/app/core";
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
    private tabService: TabService
  ) {}

  ngOnInit(): void {
    this.authorService.loadAuthors().then((authors) => {
      this.authors = authors;
    });
  }  

  onAuthorTap(args: ItemEventData): void {
    this.routerExtensions.navigate(["details", this.authors[args.index].id]);
  }

  onEditButton(button, item: AuthorModel) {
    var msg = "Edit button pressed: " + item.id;
    console.log(msg);
    button.className = "";
    button.className = "highlighted";
    this.routerExtensions.navigate(["authors", item.id]);
  }

  onSelectedIndexChanged(event)
  {
    this.tabService.onSelectedIndexChanged(event);
  }  

}

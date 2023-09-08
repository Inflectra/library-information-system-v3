import { Component, ViewChild, ElementRef } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { RouterExtensions } from "@nativescript/angular"
import { AuthorModel, AuthorService } from "~/app/core"

@Component({
  moduleId: module.id,
  selector: 'ns-author-edit',
  templateUrl: 'author.edit.component.html'
})

export class AuthorEditComponent {

  author: AuthorModel;
  
  constructor(
    private activatedRoute: ActivatedRoute, 
    private routerExtensions: RouterExtensions,
    private authorService: AuthorService
  ) {}

  ngOnInit(): void {
    const id = +this.activatedRoute.snapshot.params.id;
    if (id) {
      this.author = this.authorService.getAuthorById(id);
    }
  }  

  onAuthorNameChange(event)
  {
    if (event.value != event.oldValue)
    {
      this.author.name = event.value;
    }
  }

  onAuthorAgeChange(event)
  {
    if (event.value != event.oldValue)
    {
      this.author.age = event.value;
    }
  }   

  onUpdate(event)
  {
    console.log("Updated author: " + JSON.stringify(this.author));
    this.authorService.updateAuthor(this.author).then(() => {
      this.routerExtensions.navigate([{ outlets: { authorsTab: [ "authors", "default" ] }}]);
    });
  }

  onCancel(event)
  {
    this.routerExtensions.navigate([{ outlets: { authorsTab: [ "authors", "default" ] }}]);
  }

}

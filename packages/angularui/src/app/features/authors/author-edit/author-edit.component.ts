import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute, Params} from '@angular/router';
import { AuthorModel, LibraryService } from 'src/app/core';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-author-edit',
  templateUrl: './author-edit.component.html',
  styles: [
  ]
})
export class AuthorEditComponent implements OnInit {

  id: number = 0;

  author: AuthorModel = null;

  constructor(private route: ActivatedRoute, private router: Router, private libraryService: LibraryService, private dataService: DataService) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
        this.author = this.dataService.copyObject(this.libraryService.getAuthorById(this.id));
      }
    );    
  }

  back(event) {
    this.router.navigate([`/authors`], { replaceUrl: true });
  }

  updateAuthor(valid)
  {
    if (valid)
    {
      if (this.author.age <= 0)
      {
        this.dataService.showAlert("Author age must be a positive number.", "Error");
        return;
      }

      console.log(this.author.name);
      console.log(this.author.age);

      this.libraryService.updateAuthor(this.author).then(() => {
        this.router.navigate([`/authors`], { replaceUrl: true });
      });
    }
    else
    {
      console.log("Form input is invalid");
    }
  }  

}

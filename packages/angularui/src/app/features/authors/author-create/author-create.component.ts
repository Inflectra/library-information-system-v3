import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute, Params} from '@angular/router';
import { AuthorModel, LibraryService } from 'src/app/core';
import { DataService } from 'src/app/data.service';


@Component({
  selector: 'app-author-create',
  templateUrl: './author-create.component.html',
  styles: [
  ]
})
export class AuthorCreateComponent implements OnInit {

  author: AuthorModel = null;

  constructor(private route: ActivatedRoute, private router: Router, private libraryService: LibraryService, private dataService: DataService) { }

  ngOnInit(): void {
    this.author = {
      id: 0,
      name: "New Author",
      age: 100
    };
  }

  back(event) {
    this.router.navigate([`/authors`], { replaceUrl: true });
  }

  createAuthor(valid)
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

      this.libraryService.createAuthor(this.author).then(() => {
        this.router.navigate([`/authors`], { replaceUrl: true });
      },
      (error) => {
        this.dataService.showAlert(`${error}`, "Error");
      });
    }
    else
    {
      console.log("Form input is invalid");
    }
  }    
}

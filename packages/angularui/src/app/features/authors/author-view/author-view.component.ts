import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute, Params} from '@angular/router';
import { AuthorModel } from 'src/app/core';
import { LibraryService } from 'src/app/core';

@Component({
  selector: 'app-author-view',
  templateUrl: './author-view.component.html',
  styles: [
  ]
})
export class AuthorViewComponent implements OnInit {

  id: number = 0;

  author: AuthorModel = null;

  constructor(private route: ActivatedRoute, private router: Router, private libraryService: LibraryService) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
        this.author = this.libraryService.getAuthorById(this.id);
      }
    );    
  }

  back(event) {
    this.router.navigate([`/authors`], { replaceUrl: true });
  }

  editAuthor()
  {
    this.router.navigate([`/editauthor/${this.id}`]);
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute, Params} from '@angular/router';
import { AuthorModel, BookModel } from 'src/app/core';
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
  books: BookModel[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private libraryService: LibraryService) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
        this.author = this.libraryService.getAuthorById(this.id);
        this.books = this.libraryService.books.filter(b => b.author.id == this.id);
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

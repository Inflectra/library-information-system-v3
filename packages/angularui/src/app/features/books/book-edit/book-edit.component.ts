import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute, Params} from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { BookModel, AuthorModel, GenreModel, LibraryService } from 'src/app/core';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-book-edit',
  templateUrl: './book-edit.component.html',
  styles: [
  ]
})
export class BookEditComponent implements OnInit {

  id: number = 0;
  book: BookModel = null;
  authors: AuthorModel[];
  genres: GenreModel[];
  selectedAuthorId: number;
  selectedGenreId: number;

  dateAdded: NgbDateStruct = {
    "year": 2015,
    "month": 6,
    "day": 15
  };

  constructor(private route: ActivatedRoute, private router: Router, private libraryService: LibraryService, private dataService: DataService) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
        this.authors = this.libraryService.authors;
        this.genres = this.libraryService.genres;
        this.book = this.dataService.copyObject(this.libraryService.getBookById(this.id));
        this.selectedAuthorId = this.book.author.id;
        this.selectedGenreId = this.book.genre.id;
        var _d = new Date(this.book.dateAdded);
        this.dateAdded = {
          "year": _d.getFullYear(),
          "month": _d.getMonth() + 1,
          "day": _d.getDate()
        };
      }
    );    
  }

  back(event) {
    this.router.navigate([`/books`], { replaceUrl: true });
  } 
  
  updateBook(valid)
  {
    if (valid)
    {
      if (!this.dateAdded)
      {
        this.dataService.showAlert("Date value is empty.", "Error");
        return;
      }
      
      console.log(this.book.name);
      console.log(this.selectedAuthorId);
      console.log(this.selectedGenreId);
      console.log(this.book.outOfPrint);      
      console.log(this.dateAdded);

      this.book.author = this.authors.find(a => a.id == this.selectedAuthorId);
      this.book.genre = this.genres.find(g => g.id == this.selectedGenreId);
      this.book.dateAdded = new Date(this.dateAdded.year, this.dateAdded.month - 1, this.dateAdded.day).toISOString();

      this.libraryService.updateBook(this.book).then(() => {
        this.router.navigate([`/books`], { replaceUrl: true });
      });
    }
    else
    {
      if (typeof(this.dateAdded) != "object")
      {
        this.dataService.showAlert("Date value is invalid.", "Error");
        return;
      }

      console.log("Form input is invalid");
    }
  }

  onAuthorComboBoxChange(event)
  {

  }

  onGenreComboBoxChange(event)
  {

  }  

}

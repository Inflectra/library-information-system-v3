import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute, Params} from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { BookModel, AuthorModel, GenreModel, LibraryService } from 'src/app/core';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-book-create',
  templateUrl: './book-create.component.html',
  styles: [
  ]
})
export class BookCreateComponent implements OnInit {

  book: BookModel = null;
  authors: AuthorModel[];
  genres: GenreModel[];
  selectedAuthorId: number;
  selectedGenreId: number;

  dateAdded: NgbDateStruct = null;

  constructor(private route: ActivatedRoute, private router: Router, private libraryService: LibraryService, private dataService: DataService) { }

  ngOnInit(): void {
      this.authors = this.libraryService.authors;
      this.genres = this.libraryService.genres;
      this.book = {
        id: 0,
        name: "New Book",
        author: this.authors[0],
        genre: this.genres[0],
        outOfPrint: false,
        dateAdded: this.dataService.formatDate(new Date())
      };
      
      this.selectedAuthorId = this.book.author.id;
      this.selectedGenreId = this.book.genre.id;
      var _d = new Date(this.book.dateAdded);
      this.dateAdded = {
        "year": _d.getFullYear(),
        "month": _d.getMonth() + 1,
        "day": _d.getDate()
      };
  }

  back(event) {
    this.router.navigate([`/books`]);
  }
  
  createBook(valid)
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

      this.libraryService.createBook(this.book).then(() => {
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

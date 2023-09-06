import { Component, ViewChild, ElementRef } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { RouterExtensions } from "@nativescript/angular";
import { BookModel, BookService } from "~/app/core";

@Component({
  moduleId: module.id,
  selector: 'ns-book-edit',
  templateUrl: 'book.edit.component.html'
})

export class BookEditComponent {

  @ViewChild('gdd') genreDropDown: ElementRef;
  @ViewChild('add') authorDropDown: ElementRef;

  book: BookModel;
  
  bookName: string = "";
  authors: string[] = ["A1", "A2", "A3"];
  genres: string[] = ["G1", "G2", "G3"]; 

  selectedAuthorIndex: number = 0;
  selectedGenreIndex: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute, 
    private routerExtensions: RouterExtensions,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    const id = +this.activatedRoute.snapshot.params.id;
    if (id) {
      this.book = this.bookService.getBookById(id);

      this.bookName = this.book.name;

      var _authorArray = [];
      this.bookService.getAuthors().forEach(a => _authorArray.push(a.name));
      this.authors = _authorArray;
      this.selectedAuthorIndex = _authorArray.findIndex(a => a == this.book.author);

      var _genreArray = [];
      this.bookService.getGenres().forEach(g => _genreArray.push(g.name));
      this.genres = _genreArray;
      this.selectedGenreIndex = _genreArray.findIndex(g => g == this.book.genre);
    }
  }  

  onBookNameChange(event)
  {
    if (event.value != event.oldValue)
    {
      this.bookName = event.value;
    }
  }

  onAuthorChange(event)
  {
    console.log(`Author: oldIndex=${event.oldIndex}, newIndex=${event.newIndex}`);
    var _index = this.authorDropDown.nativeElement.selectedIndex;
    console.log(`Selected index: ${_index}`);
    this.selectedAuthorIndex = _index; 
  }   

  onGenreChange(event)
  {
    console.log(`Genre: oldIndex=${event.oldIndex}, newIndex=${event.newIndex}`);
    var _index = this.genreDropDown.nativeElement.selectedIndex;
    console.log(`Selected index: ${_index}`); 
    this.selectedGenreIndex = _index;
  } 
  
  onUpdate(event)
  {
    var _authorName = this.authors[this.selectedAuthorIndex];
    var _authorId = this.bookService.getAuthors().find(a => a.name == _authorName).id;

    var _genreName = this.genres[this.selectedGenreIndex];
    var _genreId = this.bookService.getGenres().find(g => g.name == _genreName).id;    

    var _book = {
      "id": this.book.id,
      "name": this.bookName,
      "author": _authorId,
      "genre": _genreId,
      "dateAdded": this.book.dateAdded,
      "outOfPrint": this.book.outOfPrint
    }

    console.log("Updated book: " + JSON.stringify(_book));
    this.bookService.updateBook(_book).then(() => {
      this.routerExtensions.navigate(["books"]);
    });
  }

  onCancel(event)
  {
    this.routerExtensions.navigate(["books"]);
  }

}

import { Injectable } from "@angular/core";
import { DataService } from "../../data.service";
import { BookModel, AuthorModel, GenreModel } from "../models";

@Injectable({
  providedIn: "root"
})

export class LibraryService {

  constructor(private dataService: DataService)
  {
  }  

  books: BookModel[] = [];
  authors: AuthorModel[] = [];
  genres: GenreModel[] = [];

  getBookCount(): number
  {
    return this.books.length;
  }

  getAuthorCount(): number
  {
    return this.authors.length;
  }

  getGenreCount(): number
  {
    return this.genres.length;
  }

  loadData(): Promise<boolean>
  {
    if (this.dataService.production)
    {
      return this.loadDataProd();
    }
    else
    {
      return this.loadDataTest();
    }
  }

  loadDataTest(): Promise<boolean>
  {
    return new Promise<boolean>((resolve, reject) => {

      this.books = [
        {
          id: 1,
          genre: "Murder & Mystery",
          name: "Hound of the Baskervilles",
          author: "Arthur Conan Doyle",
          dateAdded: "2015-01-17T21:00:00.000Z",
          outOfPrint: true
        },
        {
          id: 2,
          genre: "Fiction",
          name: "The Valley of Fear",
          author: "Arthur Conan Doyle",
          dateAdded: "2015-01-17T21:00:00.000Z",
          outOfPrint: false
        },
        {
          id: 3,
          genre: "Murder & Mystery",
          name: "Death on the Nile",
          author: "Agatha Christie.",
          dateAdded: "2015-01-17T21:00:00.000Z",
          outOfPrint: false      
        }
      ];

      this.authors = [
        {
          id: 1,
          name: "Arthur Conan Doyle",
          age: 125,
        },
        {
          id: 2,
          name: "Agatha Christie",
          age: 98,
        }
      ]

      resolve(true);
    });
  }

  loadDataProd(): Promise<boolean>
  {
    return new Promise<boolean>((resolve, reject) => {
      this.dataService.getDataFromBackend("books").subscribe((books: any[]) => {
        console.log(JSON.stringify(books));
        this.books = books;

        this.dataService.getDataFromBackend("authors").subscribe((authors: any[]) => {
          this.dataService.getDataFromBackend("genres").subscribe((genres: any[]) => {

            this.authors = authors;
            this.genres = genres;
            this.books.forEach(b => {
              b.author = authors.find(a => a.id == b.author)?.name;
              b.genre = genres.find(g => g.id == b.genre)?.name;
            });

            resolve(true);          
          });
        });
      });
    });
  }  
}

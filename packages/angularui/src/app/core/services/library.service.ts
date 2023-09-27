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

  books: BookModel[] = null;
  authors: AuthorModel[] = null;
  genres: GenreModel[] = null;

  getBookCount(): number
  {
    return this.books?.length;
  }

  getAuthorCount(): number
  {
    return this.authors?.length;
  }

  getGenreCount(): number
  {
    return this.genres?.length;
  }

  getBookById(id: number): BookModel
  {
    return this.books.find(b => b.id == id);
  }

  getAuthorById(id: number): AuthorModel
  {
    return this.authors.find(a => a.id == id);
  }

  getGenreById(id: number): GenreModel
  {
    return this.genres.find(g => g.id == id);
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

      this.authors = this.authors || [
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
      ];

      this.genres = this.genres || [
        {
          id: 1,
          name: "Murder & Mystery"
        },
        {
          id: 2,
          name: "Fiction"
        }
      ];

      this.books = this.books || [
        {
          id: 1,
          genre: this.getGenreById(1),
          name: "Hound of the Baskervilles",
          author: this.getAuthorById(1),
          dateAdded: "2015-01-17T21:00:00.000Z",
          outOfPrint: true
        },
        {
          id: 2,
          genre: this.getGenreById(2),
          name: "The Valley of Fear",
          author: this.getAuthorById(1),
          dateAdded: "2015-01-17T21:00:00.000Z",
          outOfPrint: false
        },
        {
          id: 3,
          genre: this.getGenreById(1),
          name: "Death on the Nile",
          author: this.getAuthorById(2),
          dateAdded: "2015-01-17T21:00:00.000Z",
          outOfPrint: false      
        }
      ];

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
              b.author = authors.find(a => a.id == b.author);
              b.genre = genres.find(g => g.id == b.genre);
            });

            resolve(true);          
          });
        });
      });
    });
  } 
  
  deleteBook(id: number) : Promise<void>
  {
    if (this.dataService.production)
    {
      return new Promise<void>((resolve, reject) => {
        this.dataService.getDataFromBackend(`books/${id}`, "delete").subscribe(() => {
          this.books = this.books.filter(b => b.id != id);
          resolve();
        },
        error => reject(error));
      });
    }
    else {
      return new Promise<void>((resolve, reject) => {
        this.books = this.books.filter(b => b.id != id);
        resolve();
      });
    }
  }

  updateBook(book: any) : Promise<void>
  {
    if (this.dataService.production)
    {
      return new Promise<void>((resolve, reject) => {

        var _book = {
          id: book.id,
          name: book.name,
          author: book.author.id,
          genre: book.genre.id,
          outOfPrint: book.outOfPrint,
          dateAdded: book.dateAdded
        }

        this.dataService.getDataFromBackend("books", "put", JSON.stringify(_book)).subscribe(() => {
          resolve();
        },
        error => reject(error));
      });
    }
    else
    {
      return new Promise<void>((resolve, reject) => {
        var _book = this.books.find(b => b.id == book.id);
        
        _book.name = book.name;
        _book.author = book.author;
        _book.genre = book.genre;
        _book.outOfPrint = book.outOfPrint;
        _book.dateAdded = book.dateAdded;
        
        resolve();
      });      
    }
  }

  createBook(book: BookModel) : Promise<void>
  {
    if (this.dataService.production)
    {
      return new Promise<void>((resolve, reject) => {

        var _book = {
          name: book.name,
          author: book.author.id,
          genre: book.genre.id,
          outOfPrint: book.outOfPrint,
          dateAdded: book.dateAdded
        }

        this.dataService.getDataFromBackend("books", "post", JSON.stringify(_book)).subscribe(() => {
          resolve();
        },
        error => reject(error));
      });
    }
    else
    {
      return new Promise<void>((resolve, reject) => {
        var maxId = 0;
        this.books.forEach(b => {
          if (b.id > maxId) maxId= b.id;
        });
        book.id = ++maxId;
        this.books.push(book);
        resolve();
      });      
    }
  }

  deleteAuthor(id: number) : Promise<void>
  {
    if (this.dataService.production)
    {
      return new Promise<void>((resolve, reject) => {
        this.dataService.getDataFromBackend(`authors/${id}`, "delete").subscribe(() => {
          this.authors = this.authors.filter(a => a.id != id);
          resolve();
        },
        error => reject(error));
      });
    }
    else {
      return new Promise<void>((resolve, reject) => {
        this.authors = this.authors.filter(a => a.id != id);
        resolve();
      });
    }
  }

  updateAuthor(author: any) : Promise<void>
  {
    if (this.dataService.production)
    {
      return new Promise<void>((resolve, reject) => {
        
        var _author = {
          id: author.id,
          name: author.name,
          age: author.age
        }        
        
        this.dataService.getDataFromBackend("authors", "put", JSON.stringify(_author)).subscribe(() => {
          resolve();
        },
        error => reject(error));
      });
    }
    else
    {
      return new Promise<void>((resolve, reject) => {
        var _author = this.authors.find(a => a.id == author.id);
        
        _author.name = author.name;
        _author.age = author.age;
        
        resolve();
      });      
    }
  }

  createAuthor(author: AuthorModel) : Promise<void>
  {
    if (this.dataService.production)
    {
      return new Promise<void>((resolve, reject) => {
        
        var _author = {
          name: author.name,
          age: author.age
        }
        
        this.dataService.getDataFromBackend("authors", "post", JSON.stringify(_author)).subscribe(() => {
          resolve();
        },
        error => reject(error));
      });
    }
    else
    {
      return new Promise<void>((resolve, reject) => {
        var maxId = 0;
        this.authors.forEach(a => {
          if (a.id > maxId) maxId= a.id;
        });
        author.id = ++maxId;
        this.authors.push(author);
        resolve();
      });      
    }
  }    
}

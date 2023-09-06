import { Injectable } from "@angular/core";
import { AuthorModel, BookModel, GenreModel } from "~/app/core/models";
import { BackendService } from "~/app/core/services";

@Injectable({
  providedIn: "root"
})

export class BookService {

  constructor(private backendService: BackendService)
  {
  }

  private books: BookModel[] = [
    {
      id: 1,
      genre: "Murder & Mystery",
      name: "Hound of the Baskervilles",
      author: "Arthur Conan Doyle",
      dateAdded: "2015-01-17T21:00:00.000Z",
      outOfPrint: false
    },
    {
      id: 2,
      genre: "Murder & Mystery",
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

  private genres: GenreModel[] = [ 
    {id: 1, name: "Murder & Mystery"}
  ]; 

  private authors: AuthorModel[] = [
    {id: 1, name: "Arthur Conan Doyle", age: 125},
    {id: 2, name: "Agatha Christie", age: 98}
  ];

  getBooks(): BookModel[] {
    return this.books;
  }

  getAuthors(): GenreModel[] {
    return this.authors;
  }

  getGenres(): GenreModel[] {
    return this.genres;
  }

  getBookById(id: number): BookModel | undefined {
    return this.books.find(book => book.id === id) || undefined;
  }

  deleteBook(id: number) : Promise<void>
  {
    return new Promise<void>((resolve, reject) => {
      this.backendService.getDataFromBackend(`books/${id}`, "delete").subscribe(() => {
        resolve();
      });
    });
  }

  updateBook(book: any) : Promise<void>
  {
    return new Promise<void>((resolve, reject) => {
      this.backendService.getDataFromBackend("books", "put", JSON.stringify(book)).subscribe(() => {
        resolve();
      });
    })
  }

  loadBooks(): Promise<BookModel[]>
  {
    return new Promise<BookModel[]>((resolve, reject) => {
      this.backendService.getDataFromBackend("books").subscribe((books) => {
        console.log(JSON.stringify(books));
        this.books = books;

        this.backendService.getDataFromBackend("authors").subscribe((authors: any[]) => {
          this.backendService.getDataFromBackend("genres").subscribe((genres: any[]) => {

            this.authors = authors;
            this.genres = genres;
            this.books.forEach(b => {
              b.author = authors.find(a => a.id == b.author)?.name;
              b.genre = genres.find(g => g.id == b.genre)?.name;
            });

            resolve(this.books);          
          });
        });
      });
    });
  }
}

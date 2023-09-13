// src/users/usersService.ts
import { Book } from "./book";
import {Db} from "../common"
import {pull,merge} from "lodash";

// A post request should not contain an id.
export type BookCreationParams = Omit<Book, "id">&Partial<Pick<Book,"id">>;

export type BookUpdateParams = Partial<Book>&Pick<Book,"id">

export class BooksService {
  public get(db:Db, id: number|string): Book {
    console.log('looking for book', id);
    const found = db.data.books.find(usr=>(''+usr.id)==(''+id) || usr.name==id) as Book;
    return found;
  }

  public find(db:Db, namePart: string): Book[] {
    console.log('looking for matching author', namePart);
    namePart = (''+namePart).toLowerCase();
    const found = db.data.books.filter(book=>(''+book.name).toLowerCase().includes(namePart));
    return found;
  }

  public all(db:Db):Book[] {
    return db.data.books;
  }

  public nextId(db:Db) {
    return db.data.books.map((book) => book.id).reduce((max, curr) => curr >= max ? curr + 1 : max, 1);
  }

  public create(db:Db, bookCreationParams: BookCreationParams): Book {
    console.log('books count before', db.data.books.length)
    const newOne = <Book>{
      ...bookCreationParams,
      id: this.nextId(db),
    };
    db.data.books.push(newOne);
    console.log('books count after', db.data.books.length)
    console.log('db',db)
    db.write();
    return newOne;
  }

  public update(db:Db, modBook: BookUpdateParams): Book {
    const oldBook:Book = this.get(db,modBook.id);
    merge(oldBook, modBook);
    db.write();
    return oldBook;
  }

  public delete(db:Db, id: number): boolean {
    const book = this.get(db, id);
    console.log('db had',db.data.books.length)
    if(book)
    {
      console.log('books. removing: ',book.name)
      pull(db.data.books,book);
      db.write();
      return true;
    } else {
      console.log('books not found',id)
      return false;
    }
  }
}
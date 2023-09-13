// src/users/usersService.ts
import {Author} from "./author";
import {Book} from "../books/book";
import {Db} from "../common"
import {pull,merge} from "lodash"

// A post request should not contain an id.
export type AuthorCreationParams = Omit<Author, "id">&Partial<Pick<Author,"id">>;;

export type AuthorUpdateParams = Partial<Author>&Pick<Author,"id">

export class AuthorsService {
  public get(db:Db, id: number|string): Author {
    console.log('looking for author', id);
    const found = db.data.authors.find(usr=>(''+usr.id)==(''+id) || usr.name==id) as Author;
    return found;
  }

  public find(db:Db, namePart: string): Author[] {
    console.log('looking for matching author', namePart);
    namePart = (''+namePart).toLowerCase();
    const found = db.data.authors.filter(author=>(''+author.name).toLowerCase().includes(namePart));
    return found;
  }

  public all(db:Db):Author[] {
    return db.data.authors;
  }

  private nextId(db:Db) {
    return db.data.authors.map((genre)=>genre.id).reduce((max,curr)=>curr>=max?curr+1:max, 1)
  }

  public create(db:Db, authorCreationParams: AuthorCreationParams): Author {
    const newOne = <Author>{
      ...authorCreationParams,
      id: this.nextId(db),
    };
    db.data.authors.push(newOne);
    db.write();
    return newOne;
  }

  public update(db:Db, modAuthor: AuthorUpdateParams): Author {
    const oldAuthor:Author = this.get(db,modAuthor.id);
    merge(oldAuthor, modAuthor);
    db.write();
    return oldAuthor;
  }

  public delete(db:Db, id: number): string {
    const author = this.get(db, id);
    console.log('db had',db.data.authors.length)
    if(author)
    {
      // Check that no books use this author
      const found = db.data.books.find(book=>book.author==id) as Book;
      if(found) {
        return `Unable to remove an author: it is used by '${found.name}'`;
      }
      pull(db.data.authors,author);
      db.write();
      return '';
    } else {
      return 'author not found'+id;
    }
  }
}
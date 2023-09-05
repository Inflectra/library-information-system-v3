// src/users/usersService.ts
import {Genre} from "./genre"
import {Book} from "../books/book"
import {Db} from "../common"
import {pull} from "lodash"

// A post request should not contain an id.
export type GenreCreationParams = Omit<Genre, "id">;

export class GenresService {
  public get(db:Db, id: number|string): Genre {
    console.log('looking for genre', id);
    const found = db.data.genres.find(usr=>(''+usr.id)==(''+id) || usr.name==id) as Genre;
    return found;
  }

  public all(db:Db):Genre[] {
    return db.data.genres;
  }

  private nextId(db:Db) {
    return db.data.genres.map((genre)=>genre.id).reduce((max,curr)=>curr>=max?curr+1:max, 1)
  }

  public create(db:Db, genreCreationParams: GenreCreationParams): Genre {
    console.log('genres count before', db.data.genres.length)
    
    const newOne = <Genre>{
      id: this.nextId(db),
      ...genreCreationParams,
    };
    db.data.genres.push(newOne);
    console.log('genres count after', db.data.genres.length)
    console.log('db',db)
    db.write();
    return newOne;
  }

  public delete(db:Db, id: number): string {
    const genre = this.get(db, id);
    console.log('db had',db.data.genres.length)
    if(genre)
    {
      // Check that no books use this genre
      const found = db.data.books.find(book=>book.genre==id) as Book;
      if(found) {
        return `Unable to remove genre: it is used by '${found.name}'`;
      }
      pull(db.data.genres,genre);
      db.write();
      return '';
    } else {
      return 'genre not found'+id;
    }
  }

}
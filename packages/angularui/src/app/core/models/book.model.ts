import { AuthorModel } from "./author.model";
import { GenreModel } from "./genre.model";

export interface BookModel {
  id: number;
  genre: GenreModel;
  name: string;
  author: AuthorModel;
  dateAdded: string;
  outOfPrint: boolean;
}

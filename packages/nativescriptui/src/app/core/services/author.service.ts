import { Injectable } from "@angular/core";
import { AuthorModel } from "~/app/core";
import { BackendService } from "~/app/core";

@Injectable({
  providedIn: "root"
})

export class AuthorService {

  constructor(private backendService: BackendService)
  {
  }  

  private authors: AuthorModel[] = [
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

  getAuthors(): AuthorModel[] {
    return this.authors;
  }

  getAuthorById(id: number): AuthorModel | undefined {
    return this.authors.find(author => author.id === id) || undefined;
  }

  updateAuthor(author: any) : Promise<void>
  {
    return new Promise<void>((resolve, reject) => {
      this.backendService.getDataFromBackend("authors", "put", JSON.stringify(author)).subscribe(() => {
        resolve();
      });
    })
  }

  loadAuthors(): Promise<AuthorModel[]>
  {
    return new Promise<AuthorModel[]>((resolve, reject) => {
      this.backendService.getDataFromBackend("authors").subscribe((authors) => {
        console.log(JSON.stringify(authors));
        this.authors = authors;
          resolve(this.authors);          
      });
    });
  }  

}

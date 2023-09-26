import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute, Params} from '@angular/router';
import { BookModel } from 'src/app/core';
import { LibraryService } from 'src/app/core';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-book-view',
  templateUrl: './book-view.component.html',
  styles: [
  ]
})
export class BookViewComponent implements OnInit {

  id: number = 0;

  book: BookModel = null;

  constructor(private route: ActivatedRoute, private router: Router, private libraryService: LibraryService, public dataService: DataService) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
        this.book = this.libraryService.getBookById(this.id);
      }
    );    
  }

  back(event) {
    this.router.navigate([`/books`]);
  }

  editBook()
  {
    this.router.navigate([`/editbook/${this.id}`]);
  }  

}

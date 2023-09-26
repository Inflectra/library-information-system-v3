import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-create',
  templateUrl: './book-create.component.html',
  styles: [
  ]
})
export class BookCreateComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  back(event) {
    this.router.navigate([`/books`]);
  }    

}

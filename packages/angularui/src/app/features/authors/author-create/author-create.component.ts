import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-author-create',
  templateUrl: './author-create.component.html',
  styles: [
  ]
})
export class AuthorCreateComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  back(event) {
    this.router.navigate([`/authors`], { replaceUrl: true });
  }    
}

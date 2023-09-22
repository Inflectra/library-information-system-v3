import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-author-view',
  templateUrl: './author-view.component.html',
  styles: [
  ]
})
export class AuthorViewComponent implements OnInit {

  id: number = 0;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
      }
    );    
  }

  back(event) {
    this.router.navigate([`/authors`], { replaceUrl: true });
  }

}

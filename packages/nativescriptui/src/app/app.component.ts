import { Component } from '@angular/core'
import { RouterExtensions } from "@nativescript/angular";
import { SelectedIndexChangedEventData } from '@nativescript/core/ui/tab-view';
import { TabView } from '@nativescript/core/ui/tab-view';

@Component({
  selector: 'ns-app',
  templateUrl: './app.component.html',
})
export class AppComponent {

  constructor(
    private routerExtensions: RouterExtensions
  ) {}  

  onSelectedIndexChanged(args: SelectedIndexChangedEventData) {

    var _index: number = args.newIndex;

    console.log("Selected tab index " + _index);

    var outlets = {};

    outlets["homeTab"] = _index == 0 ? [ "home", "default" ] :  ['emptyHome', "dummy"];
    outlets["booksTab"] = _index == 1 ? [ "books", "default" ] :  ['emptyBooks', "dummy"];
    outlets["authorsTab"] = _index == 2 ? [ "authors", "default" ] :  ['emptyAuthors', "dummy"];
    outlets["accountTab"] = _index == 3 ? [ "login", "default" ] :  ['emptyAccount', "dummy"];

    this.routerExtensions.navigate([{outlets: outlets}]);   
  }

}

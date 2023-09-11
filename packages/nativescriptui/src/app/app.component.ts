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

    if (_index != 1)
    {
      outlets["booksTab"] = ['emptyBooks'];
    }

    if (_index != 2)
    {
      outlets["authorsTab"] = ['emptyAuthors'];
    }

    if (_index == 1)
    {
      outlets["booksTab"] = [ "books", "default" ] 
    }

    if (_index == 2)
    {
      outlets["authorsTab"] = ["authors", "default"];
    }    

    this.routerExtensions.navigate([{outlets: outlets}]);   
  }

}

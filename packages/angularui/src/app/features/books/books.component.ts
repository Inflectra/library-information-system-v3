import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LibraryService, LoginService } from 'src/app/core';
import { DataService } from 'src/app/data.service';
import { BookModel } from 'src/app/core';

import {
  AngularGridInstance,
  Column,
  FieldType,
  GridOption,
  Filters
} from 'angular-slickgrid';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styles: [
  ]
})
export class BooksComponent implements OnInit {

  // slick grid
  angularGrid: AngularGridInstance;
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  books: BookModel[] = [];

  searchString: string = null;

  constructor(private libraryService: LibraryService, public loginService: LoginService, public dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    this.prepareBooksGrid();
  }

  searchStringChanged() 
  {
    this.dataService.updateFilter(this.angularGrid, this.gridOptions, "name", this.searchString);
  }

  prepareBooksGrid() 
  {
    this.columnDefinitions = [
      { 
        id: 'id', 
        name: 'Id', 
        field: 'id', 
        type: FieldType.string,
        minWidth: 50,
        maxWidth: 50,
        sortable: true
      },
      { 
        id: 'name', 
        name: 'Name', 
        field: 'name', 
        type: FieldType.string,
        minWidth: 200,
        sortable: true,
        filterable: true
      },
      { 
        id: 'author', 
        name: 'Author', 
        field: 'author', 
        type: FieldType.string,
        minWidth: 200,
        maxWidth: 300,
        sortable: true,
        formatter: this.authorFormatter,
        filterable: true,
        queryFieldFilter: "authorFullName"
      },
      { 
        id: 'genre', 
        name: 'Genre', 
        field: 'genre', 
        type: FieldType.string,
        minWidth: 200,
        maxWidth: 300,
        sortable: true,
        formatter: this.genreFormatter,
        filterable: true,
        queryFieldFilter: "genreFullName"
      },
      { 
        id: 'dateAdded', 
        name: 'Date Added', 
        field: 'dateAdded', 
        type: FieldType.string,
        minWidth: 100,
        maxWidth: 100,
        formatter: this.dateAddedFormatter,
        sortable: true,
        params: this
      },
      { 
        id: 'outOfPrint', 
        name: 'Out of Print', 
        field: 'outOfPrint', 
        type: FieldType.string,
        minWidth: 100,
        maxWidth: 100,
        formatter: this.outOfPrintFormatter,
        sortable: true
      },
      { 
        id: 'action', 
        name: 'Action', 
        field: 'id', 
        type: FieldType.string,
        minWidth: 150,
        maxWidth: 150,
        formatter: this.actionFormatter,
      },            
    ];

    this.gridOptions =
    {
      datasetIdPropertyName: "id",
      enableAutoResize: true,
      autoResize: {
        containerId: 'booksGridContainer',
        minWidth: 800
      },
      autoHeight: true,

      editable: false,
      rowSelectionOptions: {
        selectActiveRow: true,
      },      
      enableCellNavigation: false,
      showCellSelection: false,

      enableSorting: true,
      enableFiltering: true,

      enableAutoTooltip: true,
      autoTooltipOptions: {
        /** are tooltip enabled for all cells? */
        enableForCells: true,
    
        /** are tooltip enabled for column headers */
        enableForHeaderCells: false,
    
        /** what is the maximum tooltip length in pixels (only type the number) */
        maxToolTipLength: 500
      },      

      enableGridMenu: true,
      gridMenu: {
        hideExportExcelCommand: true,
        hideForceFitButton: true,
      },

      enableHeaderMenu: false,
      enableColumnPicker: false,
      enableColumnReorder: false,

      enableContextMenu: false,
      enableRowMoveManager: false,
    };
  }  

  angularGridReady(angularGrid: AngularGridInstance) 
  {
    this.angularGrid = angularGrid;
    this.angularGrid.filterService.toggleHeaderFilterRow(); 

    this.angularGrid.slickGrid.onClick.subscribe((e, p) => {
      if ($(e.target).hasClass("btn")) 
      {
        var item = this.angularGrid.dataView.getItem(p.row);
        this.deleteBook(item.id);
      }
      else if ($(e.target).hasClass("action-link"))
      {
        var item = this.angularGrid.dataView.getItem(p.row);
        if ($(e.target).hasClass("link-view")) 
        {
          this.router.navigate([`/viewbook/${item.id}`]);
        }
        else if ($(e.target).hasClass("link-edit")) 
        {
          this.router.navigate([`/editbook/${item.id}`]);
        }
      }      
    });  
    
    this.loadData();
  }

  loadData()
  {
    this.libraryService.loadData().then(() => {
      this.angularGrid.gridService.addItems(this.libraryService.books, {highlightRow: false});
    });
  }

  authorFormatter(row, cell, value, columnDef, dataContext, grid) 
  {
    dataContext.authorFullName = value.name;
    return value.name;
  }

  genreFormatter(row, cell, value, columnDef, dataContext, grid) 
  {
    dataContext.genreFullName = value.name;
    return value.name;
  }

  dateAddedFormatter(row, cell, value, columnDef, dataContext, grid) 
  {
    return columnDef.params.dataService.formatDate(value);
  }

  outOfPrintFormatter(row, cell, value, columnDef, dataContext, grid) 
  {
    return value == true ? "Yes" : "No";
  }  

  actionFormatter(row, cell, value, columnDef, dataContext, grid) 
  {
    var _id = value;
    var _actions = `<a class="action-link link-view" value="/viewbook/${_id}">View</a> | <a class="action-link link-edit">Edit</a> | <button class="btn btn-outline-secondary btn-sm">Delete</button>`;
    return _actions;
  }

  deleteBook(id: number)
  {
    console.log("Delete book: " + id);
    var book = this.libraryService.books.find(b => b.id == id);
    this.dataService.showConfirm(`Do you want to delete "${book.name}"?`, "Delete Book", "Yes", () => {
      this.libraryService.deleteBook(id).then(() => 
      {
        this.books = this.libraryService.books;
      });
    });
  }
}

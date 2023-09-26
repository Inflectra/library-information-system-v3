import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { LibraryService, LoginService } from 'src/app/core';
import { DataService } from 'src/app/data.service';
import { BookModel } from 'src/app/core';

import {
  AngularGridInstance,
  Column,
  FieldType,
  GridOption,
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

  constructor(private libraryService: LibraryService, public loginService: LoginService, public dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    this.prepareBooksGrid();
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
        sortable: true
      },
      { 
        id: 'author', 
        name: 'Author', 
        field: 'author', 
        type: FieldType.string,
        minWidth: 200,
        maxWidth: 300,
        sortable: true
      },
      { 
        id: 'genre', 
        name: 'Genre', 
        field: 'genre', 
        type: FieldType.string,
        minWidth: 200,
        maxWidth: 300,
        sortable: true
      },
      { 
        id: 'dateAdded', 
        name: 'Date Added', 
        field: 'dateAdded', 
        type: FieldType.string,
        minWidth: 100,
        maxWidth: 100,
        formatter: this.dateAddedFormatter,
        sortable: true
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
      enableFiltering: false,

      enableAutoTooltip: true,
      autoTooltipOptions: {
        /** are tooltip enabled for all cells? */
        enableForCells: true,
    
        /** are tooltip enabled for column headers */
        enableForHeaderCells: false,
    
        /** what is the maximum tooltip length in pixels (only type the number) */
        maxToolTipLength: 500
      },      

      enableGridMenu: false,
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

  dateAddedFormatter(row, cell, value, columnDef, dataContext, grid) 
  {
    var _d = new Date(value);
    return moment(_d).format("YYYY-MM-DD"); 
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

  deleteBook(id)
  {
    console.log("Delete book: " + id);
    var book = this.libraryService.books.find(b => b.id == id);
    this.dataService.showConfirm(`Do you want to delete "${book.name}"?`, "Delete Book", "Yes", () => {});
  }
}

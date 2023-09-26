import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LibraryService, LoginService } from 'src/app/core';
import { DataService } from 'src/app/data.service';
import { AuthorModel } from 'src/app/core';

import {
  AngularGridInstance,
  Column,
  FieldType,
  GridOption,
} from 'angular-slickgrid';


@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styles: [
  ]
})
export class AuthorsComponent implements OnInit {

  // slick grid
  angularGrid: AngularGridInstance;
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  authors: AuthorModel[] = [];

  searchString: string = null;

  constructor(private libraryService: LibraryService, public loginService: LoginService, public dataService: DataService, private router: Router) { }


  ngOnInit(): void {
    this.prepareAuthorsGrid();
  }

  searchStringChanged() 
  {
    this.dataService.updateFilter(this.angularGrid, this.gridOptions, "name", this.searchString);
  }  

  prepareAuthorsGrid() 
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
        id: 'age', 
        name: 'Age', 
        field: 'age', 
        type: FieldType.string,
        minWidth: 100,
        maxWidth: 100,
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
        containerId: 'authorsGridContainer',
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
    this.angularGrid.filterService.toggleHeaderFilterRow(); 

    this.angularGrid.slickGrid.onClick.subscribe((e, p) => {
      if ($(e.target).hasClass("btn")) {
        var item = this.angularGrid.dataView.getItem(p.row);
        this.deleteAuthor(item.id);
      }
      else if ($(e.target).hasClass("action-link"))
      {
        var item = this.angularGrid.dataView.getItem(p.row);
        if ($(e.target).hasClass("link-view")) 
        {
          this.router.navigate([`/viewauthor/${item.id}`]);
        }
        else if ($(e.target).hasClass("link-edit")) 
        {
          this.router.navigate([`/editauthor/${item.id}`]);
        }
      }         
    });  
    
    this.loadData();
  }

  loadData()
  {
    this.libraryService.loadData().then(() => {
      this.angularGrid.gridService.addItems(this.libraryService.authors, {highlightRow: false});
    });
  }

  actionFormatter(row, cell, value, columnDef, dataContext, grid) 
  {
    var _id = value;
    var _actions = `<a class="action-link link-view">View</a> | <a class="action-link link-edit">Edit</a> | <button class="btn btn-outline-secondary btn-sm">Delete</button>`;
    return _actions;
  }

  deleteAuthor(id)
  {
    console.log("Delete author: " + id);
    var book = this.libraryService.authors.find(b => b.id == id);
    this.dataService.showConfirm(`Do you want to delete "${book.name}"?`, "Delete Author", "Yes", () => {
      this.libraryService.deleteAuthor(id).then(() => 
      {
        this.authors = this.libraryService.authors;
      });      
    });
  }

}

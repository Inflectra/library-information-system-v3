import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient, private spinner: NgxSpinnerService, ) { }

  userLoggedOutEvent = new EventEmitter<boolean>();

  public production: boolean = true;

  public selectedRouteClassName: string = "nav-link-selected";
  
  public setActiveMainMenuItem(url: string): void
  {
    if (url == "/")
    {
      url = "/home";
    }
    var els = $("a[routerLink='" + url + "']");
    if (els.length)
    {
      els.first().addClass(this.selectedRouteClassName);
    }
  }

  private token: string = null;
  private cookie: string = null;

  public setToken(token: string)
  {
    this.token = token;
  }

  public clearToken()
  {
    this.token = null;    
  }

  public getBackendUrl()
  {
    var _url = "http://localhost:5003/api/";
    return _url;
  }

  public getDataFromBackend(query: string, method: string = "get", postData: string = null, additionalHeaders: Map<string,string> = null, errorHandler: any = null, errorHandlerParam: any = null, withSpinner: boolean = true)
  {
    var _baseUrl = this.getBackendUrl();
    var _url = _baseUrl + query;

    console.log("Query: " + query);

    var _headers = new HttpHeaders();
    _headers = _headers.set("Content-Type", "application/json");

    if (this.token) {
      _headers = _headers.set("Authorization", `Bearer ${this.token}`);
    }

    if (this.cookie) {
      _headers = _headers.set("Cookie", this.cookie);
    }

    if (additionalHeaders != null)
    {
       additionalHeaders.forEach((value, key) => { 
         _headers = _headers.set(key, value);
       });
    }       

    var _options: any = 
    {
        headers: _headers,
        observe: 'body' as const,
        responseType: 'json' as const
    }      

    if (method == "get")
    {
      if (withSpinner)
      {
        this.showSpinner();
      }
      return this.http.get(_url, _options).pipe(catchError(errorHandler ? (error) => { return errorHandler(error, errorHandlerParam) } : this.handleError), finalize(() => { 
        if (withSpinner)
        {
          this.hideSpinner() 
        }
      }));
    }
    else if (method == "post")
    {
      return this.http.post(_url, postData, _options).pipe(catchError(errorHandler ? (error) => { return errorHandler(error, errorHandlerParam) } : this.handleError));
    }
    else if (method == "put")
    {
      return this.http.put(_url, postData, _options).pipe(catchError(errorHandler ? (error) => { return errorHandler(error, errorHandlerParam) } : this.handleError));
    }    
    else if (method == "delete")
    {
      if (postData)
      {
        _options.body = postData;
        return this.http.request("delete", _url, _options).pipe(catchError(errorHandler ? (error) => { return errorHandler(error, errorHandlerParam) } : this.handleError));
      }
      else
      {
        return this.http.delete(_url, _options).pipe(catchError(errorHandler ? (error) => { return errorHandler(error, errorHandlerParam) } : this.handleError));
      }
    }
  }

  private handleError(error: HttpErrorResponse) 
  {
    var msg = "Backend error";
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      var baseUrl = error.url.split("?")[0];
      console.error(
        `Backend returned code ${error.status},\n` +
        `body was: ${error.error},\n` +
        `and URL was: ${baseUrl}`);
    }

    if (error.statusText)
    {
      msg = error.statusText;
    }

    // Return an observable with a user-facing error message.
    return throwError(msg);
  }    

  public showSpinner()
  {
    this.spinner.show();    
  }

  public hideSpinner()
  {
    this.spinner.hide();
  }

  showConfirm(text, title, action, callback)
  {
    var buttons = {};
    buttons["Cancel"] = function() 
    {
      ($(this) as any).dialog("close");
    }
    buttons[action] = function() 
    {
        ($(this) as any).dialog("close");
        callback();
    }

    var $dialog = ($('<div></div>')
    .html(text) as any)
    .dialog(
    {
      resizable: false,
      title: title,
      modal: true,
      buttons: buttons,
      open: function(e) 
      {
        var d = $(e.target).parent();
        d.css('z-index', 10000);
        d.css('background-color', '#eee');
        d.find('button:contains("Cancel"), button:contains("' + action +'")').addClass("btn btn-outline-secondary");
        d.find('button:contains("Cancel"), button:contains("' + action +'")').removeClass("ui-button ui-corner-all ui-widget");
      }
    });   

    $dialog.dialog('open');
  }

  showAlert(text, title)
  {
    var buttons = {};
    buttons["OK"] = function() 
    {
      ($(this) as any).dialog("close");
    }
 
    var $dialog = ($('<div></div>')
    .html(text) as any)
    .dialog(
    {
      resizable: false,
      title: title,
      modal: true,
      buttons: buttons,
      open: function(e) 
      {
        var d = $(e.target).parent();
        d.css('z-index', 10000);
        d.css('background-color', '#eee');
        d.find('button:contains("OK")').addClass("btn btn-outline-secondary");
        d.find('button:contains("OK")').removeClass("ui-button ui-corner-all ui-widget");
      }
    });   

    $dialog.dialog('open');
  }

  
}

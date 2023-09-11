import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, finalize } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { isAndroid, isIOS } from "@nativescript/core";

@Injectable({
  providedIn: "root"
})

export class BackendService {

  token: string = null;

  constructor(private http: HttpClient) 
  { 

  }
  
  public setToken(token: string)
  {
    this.token = token;
  }

  public clearToken()
  {
    this.token = null;    
  }

  public getDataFromBackend(query: string, method: string = "get", postData: string = null, errorHandler: any = null, errorHandlerParam: any = null) : Observable<any>
  {
    var _baseUrl = this.getBackendUrl();
    var _url = _baseUrl + query;

    console.log("Query: " + query);

    var _headers = new HttpHeaders(
    {
        'Content-Type': 'application/json'
    });

    if (this.token)
    {
      _headers = _headers.append("Authorization", "Bearer " + this.token);
    }

    var _options: any = 
    {
        headers: _headers,
        observe: 'body' as const,
        responseType: 'json' as const
    }      

    if (method == "get")
    {
      return this.http.get(_url, _options).pipe(catchError(errorHandler ? (error) => { return errorHandler(error, errorHandlerParam) } : this.handleError), finalize(() => {}));
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

  private getBackendUrl()
  {
    var androidLocalhost = "http://10.0.2.2:5000/";
    var iosLocalhost = "http://0.0.0.0:5000/";

    var url = androidLocalhost;

    if (isIOS)
    {
      url = iosLocalhost;
    }
    else if (isAndroid)
    {

    }

    return url;
  }

  private handleError(error: HttpErrorResponse) 
  {
    if (error.error && error.error.message) {
      // A client-side or network error occurred. Handle it accordingly.
      var msg = error.error.message;
      console.error(`An error occurred: ${msg}`);
      return throwError(msg);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      var baseUrl = error.url.split("?")[0];
      console.error(
        `Backend returned code ${error.status},\n` +
        `body was: ${error.error},\n` +
        `and URL was: ${baseUrl}`);
    }

    // Return an observable with a user-facing error message.
    return throwError('Error in backend.service, see details in console log.');
  }  
  
}

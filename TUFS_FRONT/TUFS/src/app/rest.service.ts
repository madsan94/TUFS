import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { Observable, of} from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { User } from './login/login'
import { HttpErrorHandler, HandleError } from './http-error-handler.service'



const endpoint = 'http://localhost:8000/'
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
@Injectable({
  providedIn: 'root'
})
export class RestService {
  private handleError:HandleError;
  constructor(private http: HttpClient,httpErrorHandler: HttpErrorHandler) 
    {
      this.handleError = httpErrorHandler.createHandleError('RestService')
    }

   
private extractData(res: Response){
  let body =res;
  return body || { };
}

Signup(user:User): Observable<User> {
  return this.http.post<User>(endpoint + 'signup',user,httpOptions).pipe(
    catchError(this.handleError('Signup',user)))
}



}

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  //Pipe to handle session expiry
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    const _request = request.clone({ withCredentials: true })

    return next.handle(_request)
      .pipe(
        catchError((error) => {
          
          if (error instanceof HttpErrorResponse) {

            if (error.status === 403 || error.status === 401){
              this.router.navigateByUrl("/login")
            }

          }

          return of(error)
        })
      );
  }
}

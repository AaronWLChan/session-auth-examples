# Angular
This project uses Angular 13.

## How do I handle page reload?
To validate a session you will need to send a request to the backend through the `validate_session` endpoint whenever the app is initialized.
In Angular, this can be done by providing a `APP_INITIALIZER` function.
```typescript
// app.module.ts
function init(authService: AuthService){
  return () => firstValueFrom(authService.validateSession())
}

@NgModule({
  declarations: [...],
  imports: [...],
  providers: [
    { provide: APP_INITIALIZER, useFactory: init, multi: true, deps: [AuthService] }, // Add Initializer function here
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
```

## How do I handle authorized routes?
To handle authorized routes you will need to create a `guard` which implements `canActivate`.
```typescript
// auth.guard.ts
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
          if (!this.authService.isLoggedIn){
            return this.router.navigateByUrl("/login")
          } 
          return true;
  }

}
```

## How do I make authenticated requests?
To make authenticated requests you will need to use an `interceptor`. Each request needs to have the `withCredentials: true` option. 
```typescript
// auth.interceptor.ts
const _request = request.clone({ withCredentials: true })
```

## How do I trigger logout when a session expires?
When the session expires, the backend will send a `401 - Unauthorized` response. To intercept responses you will have to pipe the `nextHandler`.
```typescript
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
```


## How do I handle logout?
To clear the session cookie, you will need send a request to the backend through the `logout` endpoint.
```typescript
// app.component.ts
  logout(){
    this.authService.logout()
      .pipe(
        catchError((e) => { throw new Error(e) })
      )
      .subscribe(() => {
        this.authService.loggedIn = false
        localStorage.setItem("logout", "1")
        if (this.router.url === "/auth-only") this.router.navigateByUrl("/")
      })
  }
```

### Log out all tabs
To logout out of all tabs you will need to implement an event listener which listens to changes in `LocalStorage`. 

In Angular, you can use a `HostListener` to achieve this.
```typescript
//app.component.ts
  @HostListener("window.storage", ["$event"])
  handleLogout(e: StorageEvent){
    if (e.key === "logout"){
      this.authService.loggedIn = false
      if (this.router.url === "/auth-only") this.router.navigateByUrl("/")
    }
  }
```
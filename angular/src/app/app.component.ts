import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(public authService: AuthService, private router: Router){}

  @HostListener("window:storage", ['$event'])
  handleLogout(e: StorageEvent){

    if (e.key === "logout"){
      this.authService.loggedIn = false

      if (this.router.url === "/auth-only") this.router.navigateByUrl("/")

    }
  }


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

}

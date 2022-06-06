import { Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, of, Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { User } from '../types';

@Component({
  selector: 'app-auth-only',
  templateUrl: './auth-only.component.html',
  styleUrls: ['./auth-only.component.css']
})
export class AuthOnlyComponent implements OnInit, OnDestroy {

  private subscription?: Subscription

  user?: User

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.getCurrentUser()
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe()
  }

  getCurrentUser(){
    this.subscription = this.authService.getCurrentUser()
      .pipe(
        catchError(e => {
          throw new Error(e)
        })
      )
      .subscribe((user) => {
        this.user = user
      })
  }

}

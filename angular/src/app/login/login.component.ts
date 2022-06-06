import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

interface Form {
  email: string,
  password: string
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy {

  private subscription?: Subscription

  form = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  })

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe()
  }

  onSubmit(){

    const { email, password } = this.form.value as Form

    this.subscription = this.authService.login(email, password)
      .pipe(
        catchError((error) => { throw new Error(error) })
      )
      .subscribe(() => {
        this.authService.loggedIn = true
        this.router.navigateByUrl("/auth-only")
      })

  }

}

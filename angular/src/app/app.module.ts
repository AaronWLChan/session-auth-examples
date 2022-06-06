import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AuthOnlyComponent } from './auth-only/auth-only.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from './auth.interceptor';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';

function init(authService: AuthService){
  return () => firstValueFrom(authService.validateSession())
}


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AuthOnlyComponent,
    HomeComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: init, multi: true, deps: [AuthService] },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

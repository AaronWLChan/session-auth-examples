import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { User } from './types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedIn: boolean = false

  constructor(private http: HttpClient) { }

  getCurrentUser(){
    return this.http.get<User>("/api/current_user")
  }

  login(email: string, password: string){
    return this.http.post("/api/login", { email, password }, { responseType: "text" })
  }

  logout(){
    return this.http.post("/api/logout", undefined, { responseType: "text" })
  }

  validateSession(){
    return this.http.post<{ session: boolean }>("/api/validate_session", undefined)
            .pipe(
              map((data) => {
                this.loggedIn = data.session
                return data.session
              })
            )
  }

}

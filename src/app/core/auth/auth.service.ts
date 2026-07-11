import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { map, Observable } from 'rxjs';
import { email } from '@angular/forms/signals';
import { IUser } from './IUser';
import { tap } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
    })

export class AuthService {
    constructor(
        private router: Router,
        private http: HttpClient,
        private cookieService: CookieService,
    ) {}
    baseURL = 'https://melaine-palaeobiologic-savourily.ngrok-free.dev/api/';
    tokenkey = 'token';
    currentUser :  IUser | undefined;

    getToken(): string {
        return this.cookieService.get(this.tokenkey);
    }

    setToken(token: string): void {
        this.cookieService.set(this.tokenkey, token, {path: '/' , expires: 7});
    }


    //add error handling
    register(payload: { email: string; password: string; firstName: string; lastName: string; username: string; dateOfBirth: string; role: string }): Observable<string | undefined> {
        return this.http
        .post<{token: string; user: IUser}>(
            `${this.baseURL}auth/register`,
            payload
        )
        .pipe(
            tap((response) => {
                if(!response.token) return;
                this.currentUser = response.user;
                this.setToken(response.token);
                this.router.navigate(['/']);
            }),
            map((response) => response.token)
        )
    }

    authenticate(
        email: string,
        password: string   
    ): Observable<string | undefined> {
        return this.http
        .post<{token: string; user: IUser}>(
            `${this.baseURL}auth/login`,
            {   
                Username : email, 
                Password : password,
            }
        )
        .pipe(
            tap((response) => {
                if(!response.token) return;
                this.currentUser = response.user;
                this.setToken(response.token);
                this.router.navigate(['/']);
            }),
            map((response) => response.token)
        )
    }

    isAuthenticated(): boolean {
        // i need to intrepret the token and sent it to the auth/check api to check if the token is valid and not expired based on the responce statuse 200 then valid or 401 notvlaid i contcare abput the responce just the responce state 
        return !!this.getToken();
    }

    logout(): void {
        this.cookieService.delete(this.tokenkey, '/');
        this.currentUser = undefined;
        this.router.navigate(['/login']);
    }
}

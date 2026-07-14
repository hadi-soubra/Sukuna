import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { CookieService } from "ngx-cookie-service";
import { provideHttpClient } from "@angular/common/http";


import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), provideRouter(routes),provideHttpClient(),CookieService],
};

//import { bootstrapApplication } from '@angular/platform-browser';
//import { AppStandAloneComponent } from './app/app-stand-alone.component';
//import { appConfig } from './app/app.config';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';


if (environment.production) {
  enableProdMode();
}

//bootstrapApplication(AppStandAloneComponent, appConfig).catch((err) => console.error(err));
platformBrowserDynamic().bootstrapModule(AppModule, { ngZoneEventCoalescing: true }).catch(err => console.error(err));
//platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.error(err));

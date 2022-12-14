import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormLoginComponent } from './form-login/form-login.component';
import {FormsModule} from "@angular/forms";
import {NotifierModule} from "angular-notifier";
import { CeriFeedComponent } from './ceri-feed/ceri-feed.component';
import {RouterModule} from "@angular/router";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {registerLocaleData} from "@angular/common";
import localeFr from '@angular/common/locales/fr'
import {LOCALE_ID} from "@angular/core";
import { SocketIoModule } from "ngx-socket-io";
import {environment} from "../environments/environment";

registerLocaleData(localeFr, 'fr')

//List all module used imported and needed for the project
@NgModule({
  declarations: [
    AppComponent,
    FormLoginComponent,
    CeriFeedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    FontAwesomeModule,
    NotifierModule.withConfig({
      position: {
        horizontal: {
          position: "right"
        }
      }
    }),
    FontAwesomeModule,
    NgbModule,
    SocketIoModule.forRoot({url: environment.url, options: {}})
  ],
  providers: [{provide: LOCALE_ID, useValue: 'fr'}],
  bootstrap: [AppComponent]
})
export class AppModule { }

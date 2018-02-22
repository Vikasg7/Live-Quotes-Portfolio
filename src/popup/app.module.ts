import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { RouterModule } from "@angular/router"
import { HttpModule } from "@angular/http"
import { FormsModule } from "@angular/forms"

import { App } from './components/app';
import { routes } from './routes/routes';
import { Home } from './components/home';
import { Settings } from './components/settings';
import { Logger } from './components/logger';
import { ContentEditableOnHover } from './directives/contentEditableOnHover';
import { ColorUp } from './directives/colorUp';
import { DataSrv } from './services/data';
import { ChromeMsgSrv } from './services/msg';

@NgModule({
  declarations: [
     App,
     Home,
     Settings,
     Logger,
     ContentEditableOnHover,
     ColorUp
   ],
   imports: [
      BrowserModule,
      RouterModule.forRoot(routes, {useHash: true}),
      HttpModule,
      FormsModule
  ],
  providers: [DataSrv, ChromeMsgSrv],
  bootstrap: [App]
})
export class AppModule { }
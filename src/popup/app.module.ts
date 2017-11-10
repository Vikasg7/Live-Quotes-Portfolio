import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { RouterModule } from "@angular/router"
import { HttpModule } from "@angular/http"
import { FormsModule } from "@angular/forms"

import { AppComponent } from './components/app/app.component'
import { HomeComponent } from './components/home/home.component'
import { SettingsComponent } from './components/settings/settings.component'

import { routes } from "./routes/routes"
import { DataSrv } from './services/dataSrv'
import { OnMsgSrv } from './services/onMsg'
import { SendMsgSrv } from './services/sendMsg'
import { ColorUp } from './directives/colorUp'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SettingsComponent,
    ColorUp
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpModule,
    FormsModule
  ],
  providers: [DataSrv, OnMsgSrv, SendMsgSrv],
  bootstrap: [AppComponent]
})
export class AppModule { }
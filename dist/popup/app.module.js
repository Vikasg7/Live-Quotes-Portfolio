"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const platform_browser_1 = require("@angular/platform-browser");
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const http_1 = require("@angular/http");
const forms_1 = require("@angular/forms");
const app_component_1 = require("./components/app/app.component");
const home_component_1 = require("./components/home/home.component");
const settings_component_1 = require("./components/settings/settings.component");
const routes_1 = require("./routes/routes");
const dataSrv_1 = require("./services/dataSrv");
const onMsg_1 = require("./services/onMsg");
const sendMsg_1 = require("./services/sendMsg");
const colorUp_1 = require("./directives/colorUp");
let AppModule = class AppModule {
};
AppModule = __decorate([
    core_1.NgModule({
        declarations: [
            app_component_1.AppComponent,
            home_component_1.HomeComponent,
            settings_component_1.SettingsComponent,
            colorUp_1.ColorUp
        ],
        imports: [
            platform_browser_1.BrowserModule,
            router_1.RouterModule.forRoot(routes_1.routes),
            http_1.HttpModule,
            forms_1.FormsModule
        ],
        providers: [dataSrv_1.DataSrv, onMsg_1.OnMsgSrv, sendMsg_1.SendMsgSrv],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map
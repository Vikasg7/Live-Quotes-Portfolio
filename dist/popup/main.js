require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({434:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
const app_module_1 = require("./app.module");
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule);

},{"./app.module":427,"@angular/platform-browser-dynamic":6}],427:[function(require,module,exports){
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
const app_1 = require("./components/app");
const routes_1 = require("./routes/routes");
const home_1 = require("./components/home");
const settings_1 = require("./components/settings");
const logger_1 = require("./components/logger");
const contentEditableOnHover_1 = require("./directives/contentEditableOnHover");
const colorUp_1 = require("./directives/colorUp");
const data_1 = require("./services/data");
const msg_1 = require("./services/msg");
let AppModule = class AppModule {
};
AppModule = __decorate([
    core_1.NgModule({
        declarations: [
            app_1.App,
            home_1.Home,
            settings_1.Settings,
            logger_1.Logger,
            contentEditableOnHover_1.ContentEditableOnHover,
            colorUp_1.ColorUp
        ],
        imports: [
            platform_browser_1.BrowserModule,
            router_1.RouterModule.forRoot(routes_1.routes, { useHash: true }),
            http_1.HttpModule,
            forms_1.FormsModule
        ],
        providers: [data_1.DataSrv, msg_1.ChromeMsgSrv],
        bootstrap: [app_1.App]
    })
], AppModule);
exports.AppModule = AppModule;

},{"./components/app":428,"./components/home":429,"./components/logger":430,"./components/settings":431,"./directives/colorUp":432,"./directives/contentEditableOnHover":433,"./routes/routes":435,"./services/data":436,"./services/msg":437,"@angular/core":3,"@angular/forms":4,"@angular/http":5,"@angular/platform-browser":7,"@angular/router":8}],435:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const home_1 = require("../components/home");
const settings_1 = require("../components/settings");
exports.routes = [
    { path: "home", component: home_1.Home },
    { path: "settings", component: settings_1.Settings },
    { path: "**", component: home_1.Home },
    { path: "", component: home_1.Home }
];

},{"../components/home":429,"../components/settings":431}],433:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
let ContentEditableOnHover = class ContentEditableOnHover {
    constructor(_el) {
        this._el = _el;
    }
    onClick() {
        const ele = this._el.nativeElement;
        ele.contentEditable = "true";
        ele.focus();
    }
    onBlur() {
        this._el.nativeElement.contentEditable = "false";
    }
    onEnter(e) {
        if (e.keyCode === 13) {
            this._el.nativeElement.blur();
        }
    }
};
__decorate([
    core_1.HostListener("click"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ContentEditableOnHover.prototype, "onClick", null);
__decorate([
    core_1.HostListener("blur"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ContentEditableOnHover.prototype, "onBlur", null);
__decorate([
    core_1.HostListener("keydown", ["$event"]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ContentEditableOnHover.prototype, "onEnter", null);
ContentEditableOnHover = __decorate([
    core_1.Directive({
        selector: "[content-editable-on-hover]"
    }),
    __metadata("design:paramtypes", [core_1.ElementRef])
], ContentEditableOnHover);
exports.ContentEditableOnHover = ContentEditableOnHover;

},{"@angular/core":3}],432:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
let ColorUp = class ColorUp {
    constructor(_el) {
        this._el = _el;
    }
    onValChange() {
        const val = this._el.nativeElement.innerText;
        if (val.includes("-")) {
            this._el.nativeElement.style.color = "red";
        }
        else {
            this._el.nativeElement.style.color = "green";
        }
    }
};
ColorUp = __decorate([
    core_1.Directive({
        selector: '[color-up]',
        host: {
            '(DOMSubtreeModified)': 'onValChange()'
        }
    }),
    __metadata("design:paramtypes", [core_1.ElementRef])
], ColorUp);
exports.ColorUp = ColorUp;

},{"@angular/core":3}],431:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const data_1 = require("../services/data");
const msg_1 = require("../services/msg");
let Settings = class Settings {
    constructor(dataSrv, _msgSrv) {
        this.dataSrv = dataSrv;
        this._msgSrv = _msgSrv;
        this.apiKey = localStorage["apiKey"] || "";
        this.refreshInterval = localStorage["refreshInterval"] || "60";
        this.from = localStorage.from || "9";
        this.to = localStorage.to || "17";
        if (!localStorage.from && !localStorage.to) {
            this.saveFromTo();
        }
    }
    add(input) {
        const symbol = input.value;
        if (!symbol)
            return;
        input.value = "";
        this.dataSrv.add(symbol);
    }
    saveAPIKey() {
        localStorage["apiKey"] = this.apiKey;
        // updating apiKey in bg.ts
        chrome.runtime.sendMessage({ action: "apiKey", apiKey: this.apiKey });
    }
    // Saving update interval
    saveUpInt() {
        this.refreshInterval = parseFloat(this.refreshInterval) < 60 ? "60" : this.refreshInterval;
        localStorage["refreshInterval"] = this.refreshInterval;
        // updating refreshInterval in bg.ts
        chrome.runtime.sendMessage({ action: "refreshInterval", refreshInterval: this.refreshInterval });
    }
    saveFromTo() {
        // validation
        const from = parseInt(this.from);
        const to = parseInt(this.to);
        if (to <= from) {
            this._log("Error: 'to' can't be less than or equal to'from'.");
        }
        else {
            if (from < 0 || from > 23) {
                this._log("Error: 'from' should be between 0 to 24");
                return;
            }
            if (to < 1 || to > 24) {
                this._log("Error: 'to' should be between 1 to 23");
                return;
            }
            localStorage.from = from;
            localStorage.to = to;
            this._log("from, to saved!");
        }
    }
    _log(msg) {
        this._msgSrv.send({ action: "log", status: msg });
    }
};
Settings = __decorate([
    core_1.Component({
        selector: "settings",
        template: `
      <div class="settings">
         <!-- Asking for symbols from user -->
         <div class="setting">
            <input type="text" #symbolInput placeholder="Enter Symbol here..." (keydown.enter)="add(symbolInput)">
            <button (click)="add(symbolInput)">Add</button>
            <p>
               <span *ngFor="let item of (dataSrv.data|async)">{{item.symbol}}&nbsp;</span>
            </p>
         </div>
         <!-- listing added symbols -->
         <div class="setting">
            <p><strong>Note:</strong> Please generate your own API key from <a target="_blank" href="https://www.alphavantage.co/support/#api-key">alphavantage</a> website and save it here. Otherwise, API will fail to fetch the quotes.</p>
            <input [(ngModel)]="apiKey" type="text" placeholder="Enter API key here...">
            <button (click)="saveAPIKey()">Save</button>
         </div>
         <!-- refresh interval -->
         <div class="setting">
            <p>
               <strong>Note:</strong> Enter refresh interval in seconds. Default is 60 seconds. Make sure you refresh it according to your needs. Higher is better for the servers.
            </p>
            <input [(ngModel)]="refreshInterval" type="number" placeholder="Enter Refresh Interval in sec..." min="60" maxlength="4">
            <button (click)="saveUpInt(upIntInput)">Save</button>
         </div>
         <!-- market open/close time -->
         <div class="setting">
            <p>
               <strong>Note:</strong> Please update following numbers according to your needs. This will help avoiding requesting quotes after market is closed. 
            </p>
            Market opens from
            <input id="from" type="number" min="0" max="23" maxlength="2" [(ngModel)]="from">
            to
            <input to="to" type="number" min="1" max="24" maxlength="2" [(ngModel)]="to">
            (24-hours)
            <button (click)="saveFromTo()">Save</button>
         </div>
      </div>
   `,
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [data_1.DataSrv, msg_1.ChromeMsgSrv])
], Settings);
exports.Settings = Settings;

},{"../services/data":436,"../services/msg":437,"@angular/core":3}],430:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const BehaviorSubject_1 = require("rxjs/BehaviorSubject");
const msg_1 = require("../services/msg");
let Logger = class Logger {
    constructor(_msgSrv) {
        this._msgSrv = _msgSrv;
        this._status = new BehaviorSubject_1.BehaviorSubject("");
        this.status = this._status.asObservable();
        this._msgSrv.onMsg((msg) => {
            if (msg.action === "log") {
                this._status.next(msg.status);
                setTimeout(() => this._status.next(""), 6 * 1000);
            }
        });
    }
};
Logger = __decorate([
    core_1.Component({
        selector: "logger",
        template: `
      {{status | async}}
   `,
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [msg_1.ChromeMsgSrv])
], Logger);
exports.Logger = Logger;

},{"../services/msg":437,"@angular/core":3,"rxjs/BehaviorSubject":349}],429:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const data_1 = require("../services/data");
let Home = class Home {
    constructor(dataSrv) {
        this.dataSrv = dataSrv;
    }
    del(id) {
        this.dataSrv.del(id);
    }
    update(item) {
        this.dataSrv.update(item);
    }
    trackByFn(index, item) {
        return item.id;
    }
    tInvestment() {
        return this.dataSrv.getData().reduce((agg, item) => agg + (item.shares * item.cost), 0);
    }
    tValue() {
        return this.dataSrv.getData().reduce((agg, item) => agg + (item.shares * item.price), 0);
    }
};
Home = __decorate([
    core_1.Component({
        selector: "home",
        template: `
      <div class="home" *ngIf="(dataSrv.data | async) as data else loading">      
         <div *ngIf="!data.length" class="text-red">
            1. Please add symbols in Settings tab.<br>
            2. Get a free API key from <a target="_blank" href="https://www.alphavantage.co/support/#api-key">alphavantage</a> and update in settings page.
         </div>
         <table *ngIf="data.length">
            <thead>
               <tr style="background-color: #E0E0E0">
                  <th class="symbol">Symbol</th>
                  <th>Price</th>
                  <th>Change</th>
                  <th>%Change</th>
                  <th>Target</th>
                  <th>Stoploss</th>
                  <th>Shares</th>
                  <th>Cost</th>
                  <th>Investment</th>
                  <th>Value</th>
                  <th>ROI</th>
                  <th>ROI%</th>
                  <th>&nbsp;</th>
               </tr>
            </thead>
            <tbody>
               <tr *ngFor="let item of data; let odd = odd; trackBy: trackByFn" [class.grey]="odd">
                  <td class='symbol'>{{item.symbol}}</td>
                  <td>{{item.price | number:'1.2-4'}}</td>
                  <td color-up>{{item.price - item.open | number:'1.2-4'}}</td>
                  <td color-up>{{(item.price - item.open) * 100 / item.price | number:'1.2-2'}}</td>
                  <td content-editable-on-hover [textContent]="item.target" (input)="item.target = $event.target.textContent" (blur)="update(item)" [class.green]="item.price >= item.target && item.target !== ''" ></td>
                  <td content-editable-on-hover [textContent]="item.stoploss" (input)="item.stoploss = $event.target.textContent"  (blur)="update(item)" [class.red]="item.price <= item.stoploss && item.stoploss !== ''"></td>
                  <td content-editable-on-hover [textContent]="item.shares" (input)="item.shares = $event.target.textContent"  (blur)="update(item)"></td>
                  <td content-editable-on-hover [textContent]="item.cost"  (input)="item.cost = $event.target.textContent" (blur)="update(item)"></td>
                  <td>{{item.shares * item.cost | number:'1.2-2'}}</td> <!-- Investment -->
                  <td>{{item.shares * item.price | number:'1.2-2'}}</td> <!-- Value -->
                  <td color-up>{{item.shares * (item.price - item.cost) | number:'1.2-2'}}</td> <!-- ROI -->
                  <td color-up>{{(item.price - item.cost) / item.cost * 100 | number:'1.2-2'}}</td> <!-- ROI% -->         
                  <td class="del" (click)="del(item.id)">&nbsp;X&nbsp;</td>
               </tr>
            </tbody>
            <tfoot>
               <tr style="background-color: #E0E0E0">
                  <th class="symbol">Total</th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th>{{tInvestment() | number:'1.2-2'}}</th>
                  <th>{{tValue() | number:'1.2-2'}}</th>
                  <th color-up>{{tValue() - tInvestment() | number:'1.2-2'}}</th>
                  <th color-up>{{(tValue() - tInvestment()) * 100 / tInvestment() | number:'1.2-2'}}</th>
                  <th></th>
               </tr>
            </tfoot>
         </table>
      </div>
      <ng-template #loading>Loading...</ng-template>
   `,
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [data_1.DataSrv])
], Home);
exports.Home = Home;

},{"../services/data":436,"@angular/core":3}],436:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const BehaviorSubject_1 = require("rxjs/BehaviorSubject");
const core_1 = require("@angular/core");
const msg_1 = require("./msg");
let DataSrv = class DataSrv {
    constructor(_msgSrv) {
        this._msgSrv = _msgSrv;
        this._data = new BehaviorSubject_1.BehaviorSubject([]);
        this.data = this._data.asObservable();
        this._onResp = (data) => {
            if (!data)
                return;
            this._data.next(data);
        };
        // Loading initial Data
        this._msgSrv.send({ action: "get" }, this._onResp);
        // Updating quotes on Refresh
        this._msgSrv.onMsg((msg) => {
            if (msg.action === "data") {
                this._data.next(msg.data);
            }
        });
    }
    add(symbol) {
        this._msgSrv.send({ action: "add", symbol }, this._onResp);
    }
    del(id) {
        this._msgSrv.send({ action: "del", id }, this._onResp);
    }
    update(item) {
        this._msgSrv.send({ action: "update", q: item }, this._onResp);
    }
    getData() {
        return this._data.getValue();
    }
};
DataSrv = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [msg_1.ChromeMsgSrv])
], DataSrv);
exports.DataSrv = DataSrv;

},{"./msg":437,"@angular/core":3,"rxjs/BehaviorSubject":349}],437:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
/*
NgZone monkey patched chrome messaging service.
*/
let ChromeMsgSrv = class ChromeMsgSrv {
    constructor(_ngZone) {
        this._ngZone = _ngZone;
    }
    send(msg, cb) {
        chrome.runtime.sendMessage(msg, (resp) => {
            cb && this._ngZone.run(() => cb(resp));
        });
    }
    onMsg(cb) {
        chrome.runtime.onMessage.addListener((msg) => {
            this._ngZone.run(() => cb(msg));
        });
    }
};
ChromeMsgSrv = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [core_1.NgZone])
], ChromeMsgSrv);
exports.ChromeMsgSrv = ChromeMsgSrv;

},{"@angular/core":3}],428:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
let App = class App {
    constructor() { }
};
App = __decorate([
    core_1.Component({
        selector: "app",
        template: `
      <div class="app">

         <div class="head">
            <h3 class="pull-left">Live Quotes Portfolio</h3>
            <div class="pull-right">
               <a routerLink="/home">Home</a>
               <a routerLink="/settings">Settings</a>
            </div>
            <div class="clear-fix"></div>
         </div>

         <div class="body">
            <router-outlet></router-outlet>
         </div>

         <div class="footer">
            <logger class="truncate pull-left" style="width: calc(100%-135px)"></logger>
            <div style="width: 135px" class="pull-right">
               <a target="_blank" href="https://chrome.google.com/webstore/detail/live-quotes-portfolio/gdhegkcppceeagocbpfchphhojclpmif/reviews">Review</a>
               <a target="_blank" href="https://chrome.google.com/webstore/detail/live-quotes-portfolio/gdhegkcppceeagocbpfchphhojclpmif/support">Report</a>
               <a target="_blank" href="https://paypal.me/xcelancer">Donate</a>
            </div>
            <div class="clear-fix"></div>

         </div>

      </div>
   `
    }),
    __metadata("design:paramtypes", [])
], App);
exports.App = App;

},{"@angular/core":3}]},{},[434]);

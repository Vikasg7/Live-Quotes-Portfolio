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
const dataSrv_1 = require("../../services/dataSrv");
let HomeComponent = class HomeComponent {
    constructor(_dataSrv, _changeDetector) {
        this._dataSrv = _dataSrv;
        this._changeDetector = _changeDetector;
        this._intervalInSec = 5;
        this.data = [];
        this._onData = this._dataSrv.onData().subscribe((data) => {
            if (!data)
                return;
            this.data = data;
            this._changeDetector.detectChanges(); // running change detection manually.
        });
    }
    ngOnInit() {
        this._dataSrv.getData();
        this._intervalRef = setInterval(() => this._dataSrv.getData(), this._intervalInSec * 1000);
    }
    ngOnDestroy() {
        this._onData.unsubscribe();
        clearInterval(this._intervalRef);
    }
    update(item, prop, ele) {
        const value = ele.textContent;
        item[prop] = value;
        this._changeDetector.detectChanges();
        // Updating the background page
        this._dataSrv.update({ action: "Update", symbol: item.symbol, prop, value });
    }
    delSymbol(symbol) {
        this._dataSrv.del(symbol);
    }
    trackByFn(index, item) {
        return index;
    }
    tInvestment() {
        return this.data.reduce((agg, item) => agg + (item.shares * item.cost), 0);
    }
    tValue() {
        return this.data.reduce((agg, item) => agg + (item.shares * item.price), 0);
    }
};
HomeComponent = __decorate([
    core_1.Component({
        selector: 'app-home',
        templateUrl: 'dist/popup/components/home/home.component.html',
        styleUrls: ['dist/popup/components/home/home.component.css']
    }),
    __metadata("design:paramtypes", [dataSrv_1.DataSrv, core_1.ChangeDetectorRef])
], HomeComponent);
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=home.component.js.map
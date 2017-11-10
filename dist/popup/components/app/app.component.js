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
const onMsg_1 = require("../../services/onMsg");
let AppComponent = class AppComponent {
    constructor(_onMsgSrv, _changeDetector) {
        this._onMsgSrv = _onMsgSrv;
        this._changeDetector = _changeDetector;
        this._timeoutInSec = 6;
        this.error = "";
        this._onMsg = this._onMsgSrv.onMessage().subscribe((msg) => {
            if (msg.action === "ReportError") {
                if (this._timeoutRef)
                    clearTimeout(this._timeoutRef);
                this.error = msg.error;
                this._changeDetector.detectChanges(); // running change detection manually.
                this._timeoutRef = setTimeout(() => {
                    this.error = "";
                    this._changeDetector.detectChanges(); // running change detection manually.
                }, this._timeoutInSec * 1000);
            }
        });
    }
    ngOnInit() {
    }
    ngOnDestroy() {
        this._onMsgSrv.removeListener();
        this._onMsg.unsubscribe();
    }
};
AppComponent = __decorate([
    core_1.Component({
        selector: 'app-root',
        templateUrl: 'dist/popup/components/app/app.component.html',
        styleUrls: ['dist/popup/components/app/app.component.css']
    }),
    __metadata("design:paramtypes", [onMsg_1.OnMsgSrv, core_1.ChangeDetectorRef])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map
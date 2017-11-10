import { OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { OnMsgSrv } from '../../services/onMsg';
export declare class AppComponent implements OnInit, OnDestroy {
    private _onMsgSrv;
    private _changeDetector;
    error: string;
    private _timeoutRef;
    private _onMsg;
    private _timeoutInSec;
    constructor(_onMsgSrv: OnMsgSrv, _changeDetector: ChangeDetectorRef);
    ngOnInit(): void;
    ngOnDestroy(): void;
}

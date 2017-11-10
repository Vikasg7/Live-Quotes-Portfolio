import { OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { DataSrv } from '../../services/dataSrv';
import { OnMsgSrv } from '../../services/onMsg';
export declare class SettingsComponent implements OnInit, OnDestroy {
    private _dataSrv;
    private _changeDetector;
    private _onMsgSrv;
    data: Array<any>;
    private _onData;
    apiKey: string;
    updateInterval: string;
    from: string;
    to: string;
    constructor(_dataSrv: DataSrv, _changeDetector: ChangeDetectorRef, _onMsgSrv: OnMsgSrv);
    ngOnInit(): void;
    add(input: HTMLInputElement): void;
    saveAPIKey(): void;
    saveUpInt(): void;
    saveFromTo(): void;
    private _reportError(errMsg);
    ngOnDestroy(): void;
}

import { OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { DataSrv } from '../../services/dataSrv';
export declare class HomeComponent implements OnDestroy, OnInit {
    private _dataSrv;
    private _changeDetector;
    data: Array<any>;
    private _onData;
    private _intervalRef;
    private _intervalInSec;
    noData: boolean;
    constructor(_dataSrv: DataSrv, _changeDetector: ChangeDetectorRef);
    ngOnInit(): void;
    ngOnDestroy(): void;
    update(item: any, prop: string, ele: Element): void;
    delSymbol(symbol: string): void;
    trackByFn(index: number, item: any): number;
    tInvestment(): any;
    tValue(): any;
}

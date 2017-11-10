import { Observable } from "rxjs/Observable";
export declare class OnMsgSrv {
    private _msg;
    private _observable;
    private _listener;
    constructor();
    onMessage(): Observable<any>;
    sendMessage(msg: any): void;
    removeListener(): void;
}

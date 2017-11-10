import { Observable } from "rxjs/Observable";
export declare class SendMsgSrv {
    private _resp;
    private _observable;
    constructor();
    sendMessage(msg: any): void;
    onReply(): Observable<any>;
}

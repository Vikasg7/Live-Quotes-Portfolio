import { Injectable, NgZone } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";

/*
NgZone monkey patched chrome messaging service.
*/
@Injectable()
export class ChromeMsgSrv {

   constructor(private _ngZone: NgZone) { }

   public send(msg: any, cb?: (resp: any) => any) {
      chrome.runtime.sendMessage(msg, (resp: any) => {
         cb && this._ngZone.run(() => cb(resp))
      })
   }

   public onMsg(cb: (msg: any) => any) {
      chrome.runtime.onMessage.addListener((msg: any) => {
         this._ngZone.run(() => cb(msg))
      })
   }

}
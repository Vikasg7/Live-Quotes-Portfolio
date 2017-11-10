import { Injectable } from "@angular/core"
import { Subject } from "rxjs"
import { Observable } from "rxjs/Observable"

@Injectable()
export class SendMsgSrv {
   private _resp: Subject<any>
   private _observable: Observable<any>

   constructor() {
      this._resp = new Subject<any>()
      this._observable = this._resp.asObservable()
   }
   
   public sendMessage(msg: any) {
      chrome.runtime.sendMessage(msg, (resp: any) => this._resp.next(resp))
   }

   public onReply() {
      return this._observable
   }
}
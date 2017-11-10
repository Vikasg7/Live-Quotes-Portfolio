import { Injectable } from "@angular/core"
import { Subject } from "rxjs"
import { Observable } from "rxjs/Observable"

@Injectable()
export class OnMsgSrv {
   private _msg: Subject<any>
   private _observable: Observable<any>
   private _listener: (msg: any, sender?: any, reply?: any) => any

   constructor() {
      this._msg = new Subject<any>()
      this._observable = this._msg.asObservable()
      this._listener = (msg: any, sender?: any, reply?: any) => this._msg.next(msg)
      chrome.runtime.onMessage.addListener(this._listener)
   }
   
   public onMessage() {
      return this._observable
   }

   public sendMessage(msg: any) {
      this._msg.next(msg)
   }

   public removeListener() {
      chrome.runtime.onMessage.removeListener(this._listener)
   }
}
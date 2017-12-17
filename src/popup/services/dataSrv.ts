import { Injectable } from "@angular/core"
import { SendMsgSrv } from "./sendMsg"
import { Observable } from "rxjs/Observable"

@Injectable()
export class DataSrv {
   constructor(private _sendMsg: SendMsgSrv) { }
   
   public getData() {
      // console.log("Getting data ...")
      this._sendMsg.sendMessage({action: "Get"})
   }

   public onData(): Observable<any> {
      return this._sendMsg.onReply()
   }

   public add(symbols: Array<string>) {
      // console.log("Adding symbols ", symbols)
      this._sendMsg.sendMessage({action: "Add", symbols})
   }

   public del(id: number) {
      this._sendMsg.sendMessage({action: "Del", id})
   }

   public update(msg: any) {
      this._sendMsg.sendMessage(msg)
   }
}
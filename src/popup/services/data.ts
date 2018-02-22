import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Injectable } from "@angular/core";
import { Quote } from "../models/models";
import { ChromeMsgSrv } from "./msg";

@Injectable()
export class DataSrv {
   
   public data: Observable<Array<Quote>>
   private _data: BehaviorSubject<Array<Quote>>
   private _onResp: (data: Array<Quote>) => void

   constructor(private _msgSrv: ChromeMsgSrv) {
      this._data = new BehaviorSubject<Array<Quote>>([])
      this.data = this._data.asObservable()
      this._onResp = (data: Array<Quote>) => {
         if (!data) return
         this._data.next(data)
      }
      // Loading initial Data
      this._msgSrv.send({ action: "get" }, this._onResp)
      // Updating quotes on Refresh
      this._msgSrv.onMsg((msg: any) => {
         if (msg.action === "data") {
            this._data.next(msg.data)
         }
      })
   }

   public add(symbol: string) {
      this._msgSrv.send({ action: "add", symbol }, this._onResp)      
   }

   public del(id: number) {
      this._msgSrv.send({ action: "del", id }, this._onResp)
   }

   public update(item: Quote) {
      this._msgSrv.send({ action: "update", q: item }, this._onResp)
   }

   public getData() {
      return this._data.getValue()
   }
}
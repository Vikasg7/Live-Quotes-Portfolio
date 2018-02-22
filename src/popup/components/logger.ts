import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { ChromeMsgSrv } from "../services/msg";

@Component({
   selector: "logger",
   template: `
      {{status | async}}
   `,
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class Logger {

   public status: Observable<string>
   private _status: BehaviorSubject<string>

   constructor(private _msgSrv: ChromeMsgSrv) {
      this._status = new BehaviorSubject<string>("")
      this.status = this._status.asObservable()
      this._msgSrv.onMsg((msg: any) => {
         if (msg.action === "log") {
            this._status.next(msg.status)
            setTimeout(() => this._status.next(""), 6 * 1000);
         }
      })
   }
   
}
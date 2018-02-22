import { Component, ChangeDetectionStrategy } from "@angular/core";
import { DataSrv } from "../services/data";
import { ChromeMsgSrv } from "../services/msg";

@Component({
   selector: "settings",
   template: `
      <div class="settings">
         <!-- Asking for symbols from user -->
         <div class="setting">
            <input type="text" #symbolInput placeholder="Enter Symbol here..." (keydown.enter)="add(symbolInput)">
            <button (click)="add(symbolInput)">Add</button>
            <p>
               <span *ngFor="let item of (dataSrv.data|async)">{{item.symbol}}&nbsp;</span>
            </p>
         </div>
         <!-- listing added symbols -->
         <div class="setting">
            <p><strong>Note:</strong> Please generate your own API key from <a target="_blank" href="https://www.alphavantage.co/support/#api-key">alphavantage</a> website and save it here. Otherwise, API will fail to fetch the quotes.</p>
            <input [(ngModel)]="apiKey" type="text" placeholder="Enter API key here...">
            <button (click)="saveAPIKey()">Save</button>
         </div>
         <!-- refresh interval -->
         <div class="setting">
            <p>
               <strong>Note:</strong> Enter refresh interval in seconds. Default is 60 seconds. Make sure you refresh it according to your needs. Higher is better for the servers.
            </p>
            <input [(ngModel)]="refreshInterval" type="number" placeholder="Enter Refresh Interval in sec..." min="60" maxlength="4">
            <button (click)="saveUpInt(upIntInput)">Save</button>
         </div>
         <!-- market open/close time -->
         <div class="setting">
            <p>
               <strong>Note:</strong> Please update following numbers according to your needs. This will help avoiding requesting quotes after market is closed. 
            </p>
            Market opens from
            <input id="from" type="number" min="0" max="23" maxlength="2" [(ngModel)]="from">
            to
            <input to="to" type="number" min="1" max="24" maxlength="2" [(ngModel)]="to">
            (24-hours)
            <button (click)="saveFromTo()">Save</button>
         </div>
      </div>
   `,
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class Settings {
   
   public apiKey: string
   public refreshInterval: string
   public from: string
   public to: string

   constructor(public dataSrv: DataSrv, private _msgSrv: ChromeMsgSrv) {
      this.apiKey = localStorage["apiKey"] || ""
      this.refreshInterval = localStorage["refreshInterval"] || "60"
      this.from = localStorage.from || "9"
      this.to = localStorage.to || "17"
      if (!localStorage.from && !localStorage.to) {
         this.saveFromTo()
      }
   }

   public add(input: HTMLInputElement) {
      const symbol = input.value
      if (!symbol) return
      input.value = ""
      this.dataSrv.add(symbol)
   }

   public saveAPIKey() {
      localStorage["apiKey"] = this.apiKey
      // updating apiKey in bg.ts
      chrome.runtime.sendMessage({ action: "apiKey", apiKey: this.apiKey })
   }

   // Saving update interval
   public saveUpInt() {
      this.refreshInterval = parseFloat(this.refreshInterval) < 60 ? "60" : this.refreshInterval
      localStorage["refreshInterval"] = this.refreshInterval
      // updating refreshInterval in bg.ts
      chrome.runtime.sendMessage({ action: "refreshInterval", refreshInterval: this.refreshInterval })
   }

   public saveFromTo() {
      // validation
      const from = parseInt(this.from)
      const to = parseInt(this.to)
      if (to <= from) {
         this._log("Error: 'to' can't be less than or equal to'from'.")
      } else {
         if (from < 0 || from > 23) {
            this._log("Error: 'from' should be between 0 to 24")
            return
         }
         if (to < 1 || to > 24) {
            this._log("Error: 'to' should be between 1 to 23")
            return
         }
         localStorage.from = from
         localStorage.to = to
         this._log("from, to saved!")
      }
   }

   private _log(msg: string) {
      this._msgSrv.send({ action: "log", status: msg })
   }
}
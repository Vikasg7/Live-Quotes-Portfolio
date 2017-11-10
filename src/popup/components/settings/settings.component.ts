import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { DataSrv } from '../../services/dataSrv';
import { Subscription } from 'rxjs';
import { OnMsgSrv } from '../../services/onMsg';

@Component({
  selector: 'app-settings',
  templateUrl: 'dist/popup/components/settings/settings.component.html',
  styleUrls: ['dist/popup/components/settings/settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {
  public data: Array<any>
  private _onData: Subscription
  public apiKey: string
  public updateInterval: string
  public from: string
  public to: string

  constructor(private _dataSrv: DataSrv, private _changeDetector: ChangeDetectorRef, private _onMsgSrv: OnMsgSrv) {
    this.data= []
    this._onData = this._dataSrv.onData().subscribe((data: Array<any>) => {
      this.data = data
      this._changeDetector.detectChanges() // running change detection manually.
    })
    this.apiKey = localStorage["apiKey"] || ""
    this.updateInterval = localStorage["updateInterval"] || "60"
    this.from = localStorage.from || "9"
    this.to = localStorage.to || "17"
    if (!localStorage.from && !localStorage.to) {
      this.saveFromTo()
    }
  }

  public ngOnInit() {
    this._dataSrv.getData()
  }
  
  public add(input: HTMLInputElement) {
    const symbols = input.value
    input.value = "" // Resetting value of input
    // Add only one symbols at a time
    this._dataSrv.add(symbols.split(/[,\s]+/))
  }

  public saveAPIKey() {
    localStorage["apiKey"] = this.apiKey
    // updating apiKey in bg.ts
    chrome.runtime.sendMessage({action: "ApiKey", apiKey: this.apiKey})
  }

  // Saving update interval
  public saveUpInt() {
    this.updateInterval = parseFloat(this.updateInterval) < 60 ? "60" : this.updateInterval
    localStorage["updateInterval"] = this.updateInterval
    // updating updateInterval in bg.ts
    chrome.runtime.sendMessage({ action: "UpdateInterval", updateInterval: this.updateInterval })
  }

  public saveFromTo() {
    // validation
    const from = parseInt(this.from)
    const to   = parseInt(this.to)
    if (to <= from) {
      this._reportError("Error: 'to' can't be less than or equal to'from'.")
    } else {
      if (from < 0 || from > 23) {
        this._reportError("Error: 'from' should be between 0 to 24")
        return
      }
      if (to < 1 || to > 24) {
        this._reportError("Error: 'to' should be between 1 to 23")
        return
      }
      localStorage.from = from
      localStorage.to = to
      this._reportError("from, to saved!")
    }
  }

  private _reportError(errMsg: string) {
    this._onMsgSrv.sendMessage({ action: "ReportError", error: errMsg })
  }

  public ngOnDestroy() {
    this._onData.unsubscribe()
  }
}
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core'
import { OnMsgSrv } from '../../services/onMsg'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-root',
  templateUrl: 'dist/popup/components/app/app.component.html',
  styleUrls: ['dist/popup/components/app/app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  public error: string
  private _timeoutRef: NodeJS.Timer
  private _onMsg: Subscription
  private _timeoutInSec: number

  constructor(private _onMsgSrv: OnMsgSrv, private _changeDetector: ChangeDetectorRef) {
    this._timeoutInSec = 6
    this.error = ""
    this._onMsg = this._onMsgSrv.onMessage().subscribe((msg: any) => {
      if (msg.action === "ReportError") {
        if (this._timeoutRef) clearTimeout(this._timeoutRef)
        this.error = msg.error
        this._changeDetector.detectChanges() // running change detection manually.
        this._timeoutRef = setTimeout(() => {
          this.error = ""
          this._changeDetector.detectChanges() // running change detection manually.
        }, this._timeoutInSec * 1000)
      }
    })
  }

  public ngOnInit() {

  }

  public ngOnDestroy() {
    this._onMsgSrv.removeListener()
    this._onMsg.unsubscribe()
  }
}
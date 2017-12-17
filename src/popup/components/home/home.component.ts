import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core'
import { Subscription } from 'rxjs'
import { DataSrv } from '../../services/dataSrv'

@Component({
  selector: 'app-home',
  templateUrl: 'dist/popup/components/home/home.component.html',
  styleUrls: ['dist/popup/components/home/home.component.css']
})
export class HomeComponent implements OnDestroy, OnInit {
  public data: Array<any>
  private _onData: Subscription
  private _intervalRef: NodeJS.Timer
  private _intervalInSec: number
  public noData: boolean

  constructor(private _dataSrv: DataSrv, private _changeDetector: ChangeDetectorRef) {
    this._intervalInSec = 5
    this.data = []
    this._onData = this._dataSrv.onData().subscribe((data: Array<any>) => {
      if (!data) return
      this.data = data
      if (!data.length) this.noData = true; else this.noData = false;
      this._changeDetector.detectChanges() // running change detection manually.
    })
  }

  public ngOnInit() {
    this._dataSrv.getData()
    this._intervalRef = setInterval(() => this._dataSrv.getData(), this._intervalInSec * 1000)
  }

  public ngOnDestroy() {
    this._onData.unsubscribe()
    clearInterval(this._intervalRef)
  }

  public onEnter(e: any) {
     if (e.keyCode === 13) {
        e.target.blur()
     }
  }

  public update(item: any, prop: string, ele: Element) {
    const value = ele.textContent
    item[prop] = value
    this._changeDetector.detectChanges()
    // Updating the background page
    this._dataSrv.update({action: "Update", id: item.id, prop, value})
  }

  public delSymbol(id: number) {
    this._dataSrv.del(id)
  }

  public trackByFn(index: number, item: any) {
    return item.id
  }

  public tInvestment() {
    return this.data.reduce((agg: number, item: any) => agg + (item.shares * item.cost), 0)
  }

  public tValue() {
    return this.data.reduce((agg: number, item: any) => agg + (item.shares * item.price), 0)
  }
}
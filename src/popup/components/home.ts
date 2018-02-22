import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Quote } from "../models/models";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { DataSrv } from "../services/data";

@Component({
   selector: "home",
   template: `
      <div class="home" *ngIf="(dataSrv.data | async) as data else loading">      
         <div *ngIf="!data.length" class="text-red">
            1. Please add symbols in Settings tab.<br>
            2. Get a free API key from <a target="_blank" href="https://www.alphavantage.co/support/#api-key">alphavantage</a> and update in settings page.
         </div>
         <table *ngIf="data.length">
            <thead>
               <tr style="background-color: #E0E0E0">
                  <th class="symbol">Symbol</th>
                  <th>Price</th>
                  <th>Change</th>
                  <th>%Change</th>
                  <th>Target</th>
                  <th>Stoploss</th>
                  <th>Shares</th>
                  <th>Cost</th>
                  <th>Investment</th>
                  <th>Value</th>
                  <th>ROI</th>
                  <th>ROI%</th>
                  <th>&nbsp;</th>
               </tr>
            </thead>
            <tbody>
               <tr *ngFor="let item of data; let odd = odd; trackBy: trackByFn" [class.grey]="odd">
                  <td class='symbol'>{{item.symbol}}</td>
                  <td>{{item.price | number:'1.2-4'}}</td>
                  <td color-up>{{item.price - item.open | number:'1.2-4'}}</td>
                  <td color-up>{{(item.price - item.open) * 100 / item.price | number:'1.2-2'}}</td>
                  <td content-editable-on-hover [textContent]="item.target" (input)="item.target = $event.target.textContent" (blur)="update(item)" [class.green]="item.price >= item.target && item.target !== ''" ></td>
                  <td content-editable-on-hover [textContent]="item.stoploss" (input)="item.stoploss = $event.target.textContent"  (blur)="update(item)" [class.red]="item.price <= item.stoploss && item.stoploss !== ''"></td>
                  <td content-editable-on-hover [textContent]="item.shares" (input)="item.shares = $event.target.textContent"  (blur)="update(item)"></td>
                  <td content-editable-on-hover [textContent]="item.cost"  (input)="item.cost = $event.target.textContent" (blur)="update(item)"></td>
                  <td>{{item.shares * item.cost | number:'1.2-2'}}</td> <!-- Investment -->
                  <td>{{item.shares * item.price | number:'1.2-2'}}</td> <!-- Value -->
                  <td color-up>{{item.shares * (item.price - item.cost) | number:'1.2-2'}}</td> <!-- ROI -->
                  <td color-up>{{(item.price - item.cost) / item.cost * 100 | number:'1.2-2'}}</td> <!-- ROI% -->         
                  <td class="del" (click)="del(item.id)">&nbsp;X&nbsp;</td>
               </tr>
            </tbody>
            <tfoot>
               <tr style="background-color: #E0E0E0">
                  <th class="symbol">Total</th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th>{{tInvestment() | number:'1.2-2'}}</th>
                  <th>{{tValue() | number:'1.2-2'}}</th>
                  <th color-up>{{tValue() - tInvestment() | number:'1.2-2'}}</th>
                  <th color-up>{{(tValue() - tInvestment()) * 100 / tInvestment() | number:'1.2-2'}}</th>
                  <th></th>
               </tr>
            </tfoot>
         </table>
      </div>
      <ng-template #loading>Loading...</ng-template>
   `,
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home {

   constructor(public dataSrv: DataSrv) { }

   public del(id: number) {
      this.dataSrv.del(id)
   }

   public update(item: Quote) {
      this.dataSrv.update(item)
   }

   public trackByFn(index: number, item: any) {
      return item.id
   }

   public tInvestment() {
      return this.dataSrv.getData().reduce((agg: number, item: any) => agg + (item.shares * item.cost), 0)
   }

   public tValue() {
      return this.dataSrv.getData().reduce((agg: number, item: any) => agg + (item.shares * item.price), 0)
   }
}
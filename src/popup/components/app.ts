import { Component } from "@angular/core";

@Component({
   selector: "app",
   template: `
      <div class="app">

         <div class="head">
            <h3 class="pull-left">Live Quotes Portfolio</h3>
            <div class="pull-right">
               <a routerLink="/home">Home</a>
               <a routerLink="/settings">Settings</a>
            </div>
            <div class="clear-fix"></div>
         </div>

         <div class="body">
            <router-outlet></router-outlet>
         </div>

         <div class="footer">
            <logger class="truncate pull-left" style="width: calc(100%-135px)"></logger>
            <div style="width: 135px" class="pull-right">
               <a target="_blank" href="https://chrome.google.com/webstore/detail/live-quotes-portfolio/gdhegkcppceeagocbpfchphhojclpmif/reviews">Review</a>
               <a target="_blank" href="https://chrome.google.com/webstore/detail/live-quotes-portfolio/gdhegkcppceeagocbpfchphhojclpmif/support">Report</a>
               <a target="_blank" href="https://paypal.me/xcelancer">Donate</a>
            </div>
            <div class="clear-fix"></div>

         </div>

      </div>
   `
})
export class App {

   constructor() { }

}
import { Directive, ElementRef } from "@angular/core" 

@Directive({
   selector: '[color-up]',
   host: {
      '(DOMSubtreeModified)': 'onValChange()'
   }
})
export class ColorUp {
   constructor(private _el: ElementRef) {}

   public onValChange() {
      console.log("DOMSubtreeModified")
      const val = this._el.nativeElement.innerText
      if (val.includes("-")) {
         this._el.nativeElement.style.color = "red"
      } else {
         this._el.nativeElement.style.color = "green"
      }
   }
}
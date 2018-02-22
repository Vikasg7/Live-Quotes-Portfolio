import { Directive, HostListener, ElementRef } from "@angular/core";

@Directive({
   selector: "[content-editable-on-hover]"
})
export class ContentEditableOnHover {

   constructor(private _el: ElementRef) {}

   @HostListener("click")
   onClick() {
      const ele = this._el.nativeElement
      ele.contentEditable = "true"
      ele.focus()
   }

   @HostListener("blur")
   onBlur() {
      this._el.nativeElement.contentEditable = "false"
   }

   @HostListener("keydown", ["$event"])
   onEnter(e: any) {
      if (e.keyCode === 13) {
         this._el.nativeElement.blur()   
      }
   }
}
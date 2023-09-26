import { Directive, AfterViewInit, ElementRef } from '@angular/core';
 
@Directive({
  selector: '[appAutofocus]'
})
export class AutofocusDirective implements AfterViewInit {
 
  constructor(private el: ElementRef) {
  }
 
  ngAfterViewInit() {
    var element = this.el.nativeElement;
    setTimeout(function setFocus() {
      element.focus();
    }, 10);
  }
 
}
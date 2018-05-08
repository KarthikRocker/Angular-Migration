import { Directive, HostListener, ElementRef, Input } from '@angular/core';
import { isNumber } from 'util';

@Directive({
  selector: '[appOnlyNumber]'
})
export class OnlyNumberDirective {
  private element: HTMLInputElement;
  private readonly COMMA: string;
  private readonly DOT: string;
  constructor(private elementRef: ElementRef) {
    this.element = this.elementRef.nativeElement;
    this.COMMA = ",";
    this.DOT = ".";
  }

  @Input("appOnlyNumber")
  maxLength: number;

  @HostListener("paste", ["$event"])
  onpaste(event) {
    if (event.clipboardData.getData('text').trim() != "" && !isNaN(event.clipboardData.getData('text').trim()) || (<string>event.clipboardData.getData('text').trim()).split(this.COMMA).length == 2) {
      var paste = event.clipboardData.getData('text');
      var valueToPaste = [this.element.value.slice(0, event.target.selectionStart), parseInt(paste.indexOf(".") == 0 ? "0" : paste), this.element.value.slice(event.target.selectionEnd)].join('');
      if (this.maxLength <= 0 || parseInt(valueToPaste).toString().length <= this.maxLength) {
        this.element.value = event.target.value = valueToPaste;
      }
    }
    event.preventDefault();
  }

  @HostListener("keyup", ["$event"])
  onkeyup(event) {
    if (event.target.value.indexOf(this.DOT) !== -1) {
      this.element.value = event.target.value.replace(this.DOT, this.COMMA);
    }
  }

  @HostListener("keydown", ["$event"])
  onkeydown(event) {
    let e: KeyboardEvent = <KeyboardEvent>event;

    if ([110, 188, 190].indexOf(e.keyCode) !== -1) {
      if (event.target.value.indexOf(this.COMMA) !== -1) {
        e.preventDefault();
      }
    }

    if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A
      (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+C
      (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+V
      (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+X
      (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+Z
      (e.keyCode >= 90 && (e.ctrlKey || e.metaKey) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39))) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105) && e.keyCode !== 188) {
      e.preventDefault();
    }
    // don't allow to enter left value once the length reaches max length value
    if (!this.isCursorInFractionalSection(event) && parseInt(event.target.value).toString().length >= this.maxLength) {
      e.preventDefault();
    }
  }

  private isCursorInFractionalSection(event): boolean {
    return event.target.value.indexOf(this.COMMA) !== -1 && event.target.selectionStart > event.target.value.indexOf(this.COMMA);
  }
}

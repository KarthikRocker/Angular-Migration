import { Directive, HostListener, ElementRef, Input, OnInit } from "@angular/core";
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData, CurrencyPipe, DecimalPipe } from '@angular/common';
import { NgModel } from '@angular/forms';
import { isNullOrUndefined } from "util";

// register french locale in the app for decimalPipe conversion
registerLocaleData(localeFr);

const PADDING: string = "000000";
const DEFAULT_FRACTION_VALUE: string = "00";
const DEFAULT_VALUE: string = "0,00";
const EMPTY_STRING: string = "";
const DOT: string = ".";
const COMMA: string = ",";
const THOUSANDS_SEPARATOR: string = " ";
const MAX_PRECISION: number = 2;

@Directive({
  selector: "[ngModel][appCurrencyFormatter]",
  providers: [NgModel, CurrencyPipe, DecimalPipe]
})
export class CurrencyFormatterDirective implements OnInit {
  private element: HTMLInputElement;
  constructor(public model: NgModel, private elementRef: ElementRef, private currencyPipe: CurrencyPipe, private decimalPipe: DecimalPipe) {
    this.element = this.elementRef.nativeElement;
  }

  ngOnInit(): void {
    // TODO: bring it from config
    this.element.style.textAlign = "right";
    
    if (this.model.model === 0 || this.model.value === 0) {
      setTimeout(() => {
        this.model.valueAccessor.writeValue(DEFAULT_VALUE);
      });
    }
  }

  @Input("appCurrencyFormatter")
  maxLength: number;

  @HostListener("focus", ["$event"])
  onFocus(event) {
    this.model.valueAccessor.writeValue(this.parse(event.target.value)); // opposite of transform
  }

  @HostListener("blur", ["$event"])
  onBlur(event) {
    this.model.viewToModelUpdate(parseFloat(this.parse(event.target.value).replace(COMMA, DOT).replace(/\s/g, EMPTY_STRING)));
    this.model.valueAccessor.writeValue(this.transform(event.target.value));
  }

  @HostListener("paste", ["$event"])
  onpaste(event) {
    if (event.clipboardData.getData('text').trim() != EMPTY_STRING && !isNaN(event.clipboardData.getData('text').trim()) || (<string>event.clipboardData.getData('text').trim()).split(COMMA).length == 2) {
      var paste = event.clipboardData.getData('text').replace(COMMA, DOT);
      var valueToPaste = [this.element.value.slice(0, event.target.selectionStart), parseInt(paste.indexOf(DOT) == 0 ? "0" : paste), this.element.value.slice(event.target.selectionEnd)].join(EMPTY_STRING);
      if (this.maxLength <= 0 || parseInt(valueToPaste).toString().length <= this.maxLength) {
        this.model.valueAccessor.writeValue(valueToPaste);
      }
    }
    event.preventDefault();
  }

  @HostListener("keyup", ["$event"])
  onkeyup(event) {
    if (event.target.value.indexOf(DOT) !== -1) {
      this.model.valueAccessor.writeValue(event.target.value.replace(DOT, COMMA));
    }
  }

  @HostListener("keydown", ["$event"])
  onkeydown(event) {
    let e: KeyboardEvent = <KeyboardEvent>event;

    if ([110, 188, 190].indexOf(e.keyCode) !== -1) {
      if (event.target.value.indexOf(COMMA) !== -1) {
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

  /**
   * This method is used to verify the cursor is placed in fractional part.
   * @param event 
   */
  private isCursorInFractionalSection(event): boolean {
    return event.target.value.indexOf(COMMA) !== -1 && event.target.selectionStart > event.target.value.indexOf(COMMA);
  }

  /**
   * 
   * @param value It will be a number. Example: 99999999.99
   * @param fractionSize Default precision is 2
   * @returns The reutrn value will be a string. Example: 99999999.99 => 99 999 999,99
   */
  private transform(value: number | string, fractionSize: number = MAX_PRECISION): string {
    var validValue = value.toString().replace(COMMA, DOT).replace(/\s/g, EMPTY_STRING).trim();
    return isNullOrUndefined(validValue) || validValue == EMPTY_STRING || validValue == DOT ? DEFAULT_VALUE :
      this.decimalPipe.transform(validValue, '1.2-2', 'fr').trim();
  }

  /**
   * 
   * @param value It will be a string. Example: 9 999 999 999,999
   * @param fractionSize Default precision is 2
   * @returns The return value will be a fractional number. Example: 9 999 999 999.9999 => 10000000000.00
   */
  private parse(value: string, fractionSize: number = MAX_PRECISION): string {
    var validValue = value.toString().replace(COMMA, DOT).replace(/\s/g, EMPTY_STRING).trim();
    return isNullOrUndefined(validValue) || validValue == EMPTY_STRING || validValue == DOT ? DEFAULT_VALUE :
      this.decimalPipe.transform(validValue, '1.2-2', 'fr').replace(/\s/g, EMPTY_STRING).trim();
  }
}

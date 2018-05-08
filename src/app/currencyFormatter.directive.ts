import { Directive, HostListener, ElementRef, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { NgModel } from '@angular/forms';
import { MyCurrencyPipe } from "./my-currency-input-control/my-currency.pipe";

@Directive({
    selector: "[ngModel][appMyCurrencyFormatter]",
    providers: [MyCurrencyPipe, NgModel],
    host: {
        '(ngModelChange)': 'onInputChange($event)'
    }
})
export class MyCurrencyFormatterDirective implements OnInit {

    private element: HTMLInputElement;
    private readonly COMMA: string;
    private readonly DOT: string;
    constructor(private elementRef: ElementRef, private currencyPipe: MyCurrencyPipe) {
        this.element = this.elementRef.nativeElement;
        this.COMMA = ",";
        this.DOT = ".";
    }

    ngOnInit() {
        if (this.amount === 0) {
            this.element.innerText = "0,00";
        }
    }

    private _amount: number;
    @Input("ngModel")
    get amount(): number {
        return this._amount;
    }
    set amount(value) {
        this._amount = parseFloat(value.toString().replace(this.COMMA, this.DOT));
        this.amountChange.emit(this._amount);
    }

    @Output() amountChange = new EventEmitter<number>();

    @Input("appMyCurrencyFormatter")
    maxLength: number;

    onInputChange(value) {
        this.amount = parseFloat(this.currencyPipe.parse(value).replace(",", ".").replace(/\s/g, ""));
    }

    @HostListener("focus", ["$event"])
    onFocus(event) {
        this.element.value = this.currencyPipe.parse(event.target.value); // opposite of transform
    }

    @HostListener("blur", ["$event"])
    onBlur(event) {
        this.element.value = this.currencyPipe.transform(event.target.value);
        this.amount = parseFloat(this.currencyPipe.parse(event.target.value).replace(",", ".").replace(/\s/g, ""));
    }

    @HostListener("paste", ["$event"])
    onpaste(event) {
        if (event.clipboardData.getData('text').trim() != "" && !isNaN(event.clipboardData.getData('text').trim()) || (<string>event.clipboardData.getData('text').trim()).split(this.COMMA).length == 2) {
            var paste = event.clipboardData.getData('text').replace(this.COMMA, this.DOT);
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
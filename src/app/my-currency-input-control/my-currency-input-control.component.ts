import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MyCurrencyPipe } from './my-currency.pipe';

@Component({
  selector: 'app-my-currency-input-control',
  templateUrl: './my-currency-input-control.component.html',
  styleUrls: ['./my-currency-input-control.component.css']
})
export class MyCurrencyInputControlComponent implements OnInit {
  private _amount: number;
  @Input()
  get amount(): number {
    return this._amount;
  }
  set amount(value) {
    this._amount = value;
    this.amountChange.emit(this._amount);
  }

  @Output() amountChange = new EventEmitter<number>();

  amountText: string;
  myMaxLength: number;
  constructor(private currencyPipe: MyCurrencyPipe) {
    this.myMaxLength = 13;
  }

  ngOnInit() {
    if (this.amount === 0) {
      this.amountText = "0,00";
    }
  }

  onChange(event) {
    this.amount = parseFloat(this.currencyPipe.parse(event.target.value).replace(",", ".").replace(/\s/g, ""));
  }

  onFocus(event) {
    this.amountText = event.target.value = this.currencyPipe.parse(event.target.value); // opposite of transform
  }

  onBlur(event) {
    this.amountText = event.target.value = this.currencyPipe.transform(event.target.value);
    this.amount = parseFloat(this.currencyPipe.parse(event.target.value).replace(",", ".").replace(/\s/g, ""));
  }
}
